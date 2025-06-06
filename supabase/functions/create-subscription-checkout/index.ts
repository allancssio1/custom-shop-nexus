
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

    const { planType } = await req.json();
    if (!planType || !['basico', 'intermediario', 'avancado'].includes(planType)) {
      throw new Error("Invalid plan type");
    }
    logStep("Plan type validated", { planType });

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
    logStep("Store found", { storeId: store.id });

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

    // Define plan details
    const planDetails = {
      basico: { price: 3000, name: "Plano Básico", limit: 99 },
      intermediario: { price: 5500, name: "Plano Intermediário", limit: 199 },
      avancado: { price: 8000, name: "Plano Avançado", limit: 999999 }
    };

    const selectedPlan = planDetails[planType as keyof typeof planDetails];
    logStep("Plan details", selectedPlan);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: selectedPlan.name,
              description: `Até ${selectedPlan.limit} clientes cadastrados`
            },
            unit_amount: selectedPlan.price,
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
        plan_type: planType,
        client_limit: selectedPlan.limit.toString(),
        monthly_price: (selectedPlan.price / 100).toString()
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
