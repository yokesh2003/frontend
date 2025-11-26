export interface PaymentCard {
  cardId: number;
  customerId: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  cardType: string;
}

export interface PaymentRequest {
  customerId: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  cardType: string;
}

export interface ProcessPaymentRequest {
  customerId: number;
  cardId: number;
  cvv: string;
}

