import { Audiobook } from './Audiobook';

export interface CartItem {
  audioCartId: number;
  cartId: number;
  audioId: number;
  audiobook: Audiobook;
}

export interface Cart {
  cartId: number;
  customerId: number;
  cartItems: CartItem[];
}

