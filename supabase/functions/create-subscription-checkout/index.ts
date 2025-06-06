
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get store data
    const { data: authUser } = await supabaseClient
      .from('auth_users')
      .select('id')
      .eq('login', user.email)
      .single();

    if (!authUser) throw new Error("Auth user not found");

    const { data: store } = await supabaseClient
      .from('stores')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (!store) throw new Error("Store not found");
    logStep("Store found", { storeId: store.id, clientCount: store.client_count });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ 
      email: user.email,
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: store.name,
        metadata: {
          store_id: store.id,
          store_name: store.name
        }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Calculate pricing based on client count
    const clientCount = store.client_count || 0;
    const basePrice = 3000; // R$ 30.00 in cents
    const baseLimit = 199;
    const extraClientPrice = 10; // R$ 0.10 in cents
    
    let totalPrice = basePrice;
    if (clientCount > baseLimit) {
      const extraClients = clientCount - baseLimit;
      totalPrice += extraClients * extraClientPrice;
    }

    logStep("Pricing calculated", { clientCount, basePrice, totalPrice });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Plano Único - Sistema de Gestão",
              description: `R$ 30,00 base + R$ 0,10 por cliente extra (atual: ${clientCount} clientes)`
            },
            unit_amount: totalPrice,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/store/${store.slug}/subscription?success=true`,
      cancel_url: `${req.headers.get("origin")}/store/${store.slug}/subscription?canceled=true`,
      metadata: {
        store_id: store.id,
        client_count: clientCount.toString(),
        base_price: "30.00",
        total_price: (totalPrice / 100).toString()
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
