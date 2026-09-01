declare module 'react-native-razorpay' {
  export type RazorpayCheckoutOptions = {
    key: string;
    amount: number | string;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
      backdrop_color?: string;
    };
    modal?: {
      backdropclose?: boolean;
      confirm_close?: boolean;
    };
  };

  export type RazorpayPaymentSuccess = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };

  export type RazorpayPaymentError = {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
  };

  const RazorpayCheckout: {
    open(options: RazorpayCheckoutOptions): Promise<RazorpayPaymentSuccess>;
  };

  export default RazorpayCheckout;
}
