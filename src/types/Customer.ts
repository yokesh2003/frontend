export interface Customer {
  customerId: number;
  username: string;
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  customerId: number;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
  newPassword: string;
}

