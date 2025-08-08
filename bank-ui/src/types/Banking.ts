export interface Account {
  accountNumber: string;
  balance: number;
  username: string;
}

export interface CreateAccountRequest {
  userId: number;
  initialBalance: number;
}

export interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  amount: number;
  accountFrom?: string;
  accountTo?: string;
  timestamp: string;
  description: string;
}

export interface DepositWithdrawRequest {
  amount: number;
}

export interface TransferRequest {
  accountFrom: string;
  accountTo: string;
  amount: number;
}

export interface TransactionResponse {
  message: string;
  accountFromBalance: number;
  accountToBalance: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
