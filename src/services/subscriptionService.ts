
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  hasSubscription: boolean;
  planType: string;
  clientCount: number;
  clientLimit: number;
  canAddClients: boolean;
  subscriptionEnd?: string;
  monthlyPrice?: number;
}

export const checkSubscription = async (): Promise<SubscriptionStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Error checking subscription:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Subscription check failed:', error);
    throw error;
  }
};

export const createSubscriptionCheckout = async (planType: string): Promise<{ url: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
      body: { planType }
    });
    
    if (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    throw error;
  }
};

export const openCustomerPortal = async (): Promise<{ url: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Customer portal failed:', error);
    throw error;
  }
};

export const getRecommendedPlan = (clientCount: number) => {
  if (clientCount <= 99) {
    return { planType: 'basico', clientLimit: 99, monthlyPrice: 30 };
  } else if (clientCount <= 199) {
    return { planType: 'intermediario', clientLimit: 199, monthlyPrice: 55 };
  } else {
    return { planType: 'avancado', clientLimit: 999999, monthlyPrice: 80 };
  }
};
