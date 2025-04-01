export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface BalanceTrendData {
  date: string;
  balance: number;
}

export interface LoanRecommendation {
  approved: boolean;
  score: number;
  maxAmount: number;
  reason: string;
}

export interface StatementSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  endingBalance: number;
}

// Raw data extracted from PDF
export interface RawStatementData {
  transactions: {
    date: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
  }[];
  regularPayments: {
    description: string;
    amount: number;
    frequency: "monthly" | "weekly" | "quarterly";
  }[];
  categories: {
    name: string;
    value: number;
    color: string;
  }[];
  balanceTrend: {
    date: string;
    balance: number;
  }[];
  metadata: {
    bankName: string;
    accountHolder: string;
    statementPeriod: {
      start: string;
      end: string;
    };
  };
}

// Final analysis result
export interface ProcessedStatement {
  statements: RawStatementData[];
  summary: {
    totalDeposits: number;
    totalWithdrawals: number;
    endingBalance: number;
    regularPayments: {
      description: string;
      amount: number;
      frequency: "monthly" | "weekly" | "quarterly";
    }[];
  };
  categories: {
    name: string;
    value: number;
    color: string;
  }[];
  balanceTrend: {
    date: string;
    balance: number;
  }[];
  loanRecommendation: {
    approved: boolean;
    score: number;
    maxAmount: number;
    reason: string;
    keyFactors: {
      incomeStability: number;
      spendingPatterns: number;
      regularPayments: number;
      balanceTrend: number;
    };
  };
  metadata: {
    bankName: string;
    accountHolder: string;
    statementPeriod: {
      start: string;
      end: string;
    };
  };
} 