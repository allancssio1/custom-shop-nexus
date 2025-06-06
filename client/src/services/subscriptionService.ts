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
    const response = await fetch('/api/subscription/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription check error:', error);
    // Return default trial subscription for fallback
    return {
      hasSubscription: false,
      planType: 'trial',
      clientCount: 3,
      basePrice: 29.99,
      extraClientsCharge: 0,
      totalMonthlyPrice: 29.99,
      canAddClients: true,
      subscriptionEnd: undefined
    };
  }
};

export const createSubscriptionCheckout = async (): Promise<{ url: string }> => {
  try {
    const response = await fetch('/api/subscription/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Checkout creation error:', error);
    throw error;
  }
};

export const openCustomerPortal = async (): Promise<{ url: string }> => {
  try {
    const response = await fetch('/api/subscription/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to open customer portal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Customer portal error:', error);
    throw error;
  }
};

export const calculateSubscriptionPrice = (clientCount: number) => {
  const basePrice = 29.99;
  const includedClients = 5;
  const extraClientPrice = 2.99;

  if (clientCount <= includedClients) {
    return {
      basePrice,
      extraClientsCharge: 0,
      totalPrice: basePrice,
      extraClients: 0
    };
  }

  const extraClients = clientCount - includedClients;
  const extraClientsCharge = extraClients * extraClientPrice;
  const totalPrice = basePrice + extraClientsCharge;

  return {
    basePrice,
    extraClientsCharge,
    totalPrice,
    extraClients
  };
};