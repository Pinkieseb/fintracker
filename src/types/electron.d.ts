import { FinancialCycle, Transaction, Customer } from '@prisma/client';

type ErrorResponse = {
  error: true;
  message: string;
};

type ApiResponse<T> = T | ErrorResponse;

type PaginatedTransactionsResponse = {
  transactions: Transaction[];
  total: number;
};

export interface ElectronAPI {
  getFinancialCycles: () => Promise<ApiResponse<FinancialCycle[]>>;
  saveFinancialCycle: (cycle: Omit<FinancialCycle, 'id' | 'timestamp'>) => Promise<ApiResponse<FinancialCycle>>;
  getTransactions: () => Promise<ApiResponse<Transaction[]>>;
  getTransactionsByCycle: (cycleId: number, page: number, itemsPerPage: number) => Promise<ApiResponse<PaginatedTransactionsResponse>>;
  getAllTransactionsByCycle: (cycleId: number) => Promise<ApiResponse<Transaction[]>>;
  saveTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<ApiResponse<Transaction>>;
  getCustomers: () => Promise<ApiResponse<Customer[]>>;
  getCustomer: (id: number) => Promise<ApiResponse<Customer | null>>;
  getCustomerTransactions: (customerId: number) => Promise<ApiResponse<Transaction[]>>;
  saveCustomer: (customer: Omit<Customer, 'id'>) => Promise<ApiResponse<Customer>>;
  getLatestFinancialCycle: () => Promise<ApiResponse<FinancialCycle | null>>;
  getConsolidationData: () => Promise<ApiResponse<{ inventory: number; balance: number; unitCost: number }>>;
  updateConsolidationData: (data: { inventory: number; balance: number }) => Promise<ApiResponse<void>>;
  getVersion: () => Promise<ApiResponse<string>>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
