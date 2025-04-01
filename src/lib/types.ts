export interface RegularPayment {
  description: string;
  amount: number;
  frequency: string;
}

export interface Category {
  name: string;
  value: number;
  color: string;
}

export interface BalancePoint {
  date: string;
  balance: number;
}

export interface StatementMetadata {
  bankName: string;
  accountHolder: string;
  statementPeriod: {
    start: string;
    end: string;
  };
}

export interface StatementSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  endingBalance: number;
  regularPayments: RegularPayment[];
}

export interface LoanRecommendation {
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
}

export interface ProcessedStatement {
  statements: RawStatementData[];
  summary: StatementSummary;
  categories: Category[];
  balanceTrend: BalancePoint[];
  loanRecommendation: LoanRecommendation;
  metadata: StatementMetadata;
}

export interface RawStatementData {
  regularPayments: RegularPayment[];
  categories: Category[];
  balanceTrend: BalancePoint[];
  metadata: StatementMetadata;
} 