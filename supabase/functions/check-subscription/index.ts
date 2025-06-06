
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

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
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

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
    
    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ 
      email: user.email,
      limit: 1 
    });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, no subscription");
      return new Response(JSON.stringify({ 
        hasSubscription: false, 
        clientCount: store.client_count || 0,
        clientLimit: 5, // Trial limit
        planType: 'trial',
        canAddClients: (store.client_count || 0) < 5
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Customer found", { customerId });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logStep("No active subscription found");
      return new Response(JSON.stringify({ 
        hasSubscription: false,
        clientCount: store.client_count || 0,
        clientLimit: 5,
        planType: 'trial',
        canAddClients: (store.client_count || 0) < 5
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscription = subscriptions.data[0];
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
    logStep("Active subscription found", { subscriptionId: subscription.id });

    // Determine plan type from price
    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount || 0;
    
    let planType = 'basico';
    let clientLimit = 99;
    
    if (amount <= 3000) {
      planType = 'basico';
      clientLimit = 99;
    } else if (amount <= 5500) {
      planType = 'intermediario';
      clientLimit = 199;
    } else {
      planType = 'avancado';
      clientLimit = 999999;
    }

    logStep("Plan determined", { planType, clientLimit, amount });

    // Update or create subscription record
    const { error: upsertError } = await supabaseClient
      .from('subscriptions')
      .upsert({
        store_id: store.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        plan_type: planType,
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: subscriptionEnd,
        client_limit: clientLimit,
        monthly_price: amount / 100,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'store_id'
      });

    if (upsertError) {
      logStep("Error upserting subscription", upsertError);
    } else {
      logStep("Subscription record updated");
    }

    const clientCount = store.client_count || 0;
    const canAddClients = clientCount < clientLimit;

    return new Response(JSON.stringify({
      hasSubscription: true,
      planType,
      clientCount,
      clientLimit,
      canAddClients,
      subscriptionEnd,
      monthlyPrice: amount / 100
    }), {
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
