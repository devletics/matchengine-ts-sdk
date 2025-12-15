/**
 * Stripe PaymentIntent response for completing payment.
 */
export interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}
