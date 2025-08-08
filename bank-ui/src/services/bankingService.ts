import apiClient from "./authService";
import type {
  Account,
  CreateAccountRequest,
  TransferRequest,
  TransactionResponse,
} from "../types/Banking";

export interface TransactionHistoryItem {
  message: string;
  accountFromBalance: number;
  accountToBalance: number;
}

export const bankingService = {
  // Account operations
  async createAccount(accountData: CreateAccountRequest): Promise<Account> {
    const response = await apiClient.post<Account>("/accounts", accountData);
    return response.data;
  },

  async getAccounts(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>("/accounts");
    return response.data;
  },

  async getAccount(accountNumber: string): Promise<Account> {
    const response = await apiClient.get<Account>(`/accounts/${accountNumber}`);
    return response.data;
  },

  // Transaction operations
  async deposit(amount: number): Promise<TransactionResponse> {
    const response = await apiClient.post<TransactionResponse>(
      "/transactions/deposit",
      { amount }
    );
    return response.data;
  },

  async withdraw(amount: number): Promise<TransactionResponse> {
    const response = await apiClient.post<TransactionResponse>(
      "/transactions/withdraw",
      { amount }
    );
    return response.data;
  },

  async transfer(transferData: TransferRequest): Promise<TransactionResponse> {
    const response = await apiClient.post<TransactionResponse>(
      "/transactions/transfer",
      transferData
    );
    return response.data;
  },

  async getTransactionHistory(): Promise<TransactionHistoryItem[]> {
    try {
      const response = await apiClient.get<TransactionHistoryItem[]>(
        "/transactions/history"
      );
      return response.data;
    } catch (error) {
      console.error("Error in getTransactionHistory:", error);
      throw error;
    }
  },

  // Utility functions
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  formatAccountNumber(accountNumber: string): string {
    return accountNumber.replace(/(\d{4})(?=\d)/g, "$1-");
  },
};

export default bankingService;
