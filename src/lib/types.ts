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

export interface ProcessedStatement {
  transactions: {
    date: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
  }[];
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