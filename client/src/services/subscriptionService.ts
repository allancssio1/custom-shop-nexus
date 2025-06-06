
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  hasSubscription: boolean;
  planType: string;
  clientCount: number;
  basePrice: number;
  extraClientsCharge: number;
  totalMonthlyPrice: number;
  canAddClients: boolean;
  subscriptionEnd?: string;
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

export const createSubscriptionCheckout = async (): Promise<{ url: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-subscription-checkout');
    
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

export const calculateSubscriptionPrice = (clientCount: number) => {
  const basePrice = 30.00;
  const baseLimit = 199;
  const extraClientPrice = 0.10;
  
  if (clientCount <= baseLimit) {
    return {
      basePrice,
      extraClientsCharge: 0,
      totalMonthlyPrice: basePrice,
      extraClients: 0
    };
  }
  
  const extraClients = clientCount - baseLimit;
  const extraClientsCharge = extraClients * extraClientPrice;
  
  return {
    basePrice,
    extraClientsCharge,
    totalMonthlyPrice: basePrice + extraClientsCharge,
    extraClients
  };
};
