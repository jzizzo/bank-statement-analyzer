/**
 * Core type definitions for the bank statement analyzer application.
 * These types define the structure of bank statement data, analysis results,
 * and loan recommendations.
 */

/**
 * Represents a recurring payment identified in the bank statement.
 */
export interface RegularPayment {
  /** Description of the payment (e.g., "Rent", "Utilities") */
  description: string;
  /** Amount of the payment */
  amount: number;
  /** Frequency of the payment (e.g., "Monthly", "Weekly") */
  frequency: string;
}

/**
 * Represents a spending category with its total value and display color.
 */
export interface Category {
  /** Name of the spending category */
  name: string;
  /** Total value of transactions in this category */
  value: number;
  /** Color code for visualization */
  color: string;
}

/**
 * Represents a single point in the account balance history.
 */
export interface BalancePoint {
  /** Date of the balance point */
  date: string;
  /** Account balance at this point */
  balance: number;
}

/**
 * Contains metadata about the bank statement.
 */
export interface StatementMetadata {
  /** Name of the bank issuing the statement */
  bankName: string;
  /** Name of the account holder */
  accountHolder: string;
  /** Currency code (e.g., "USD", "GBP", "AUD", "INR") */
  currency: string;
  /** Period covered by the statement */
  statementPeriod: {
    /** Start date of the statement period */
    start: string;
    /** End date of the statement period */
    end: string;
  };
}

/**
 * Summary statistics extracted from the bank statement.
 */
export interface StatementSummary {
  /** Total amount of deposits during the period */
  totalDeposits: number;
  /** Total amount of withdrawals during the period */
  totalWithdrawals: number;
  /** Final account balance */
  endingBalance: number;
  /** List of identified regular payments */
  regularPayments: RegularPayment[];
}

/**
 * Loan recommendation based on statement analysis.
 */
export interface LoanRecommendation {
  /** Whether the loan is approved */
  approved: boolean;
  /** Credit score (0-100) based on analysis */
  score: number;
  /** Maximum recommended loan amount */
  maxAmount: number;
  /** Explanation of the recommendation */
  reason: string;
  /** Key factors considered in the analysis */
  keyFactors: {
    /** Score for income stability (0-100) */
    incomeStability: number;
    /** Score for spending patterns (0-100) */
    spendingPatterns: number;
    /** Score for regular payment history (0-100) */
    regularPayments: number;
    /** Score for balance trend (0-100) */
    balanceTrend: number;
  };
}

/**
 * Complete processed bank statement with analysis results.
 */
export interface ProcessedStatement {
  /** Raw statement data chunks */
  statements: RawStatementData[];
  /** Summary statistics */
  summary: StatementSummary;
  /** Spending categories */
  categories: Category[];
  /** Balance history */
  balanceTrend: BalancePoint[];
  /** Loan recommendation */
  loanRecommendation: LoanRecommendation;
  /** Statement metadata */
  metadata: StatementMetadata;
}

/**
 * Raw data extracted from a bank statement chunk.
 */
export interface RawStatementData {
  /** Regular payments identified in this chunk */
  regularPayments: RegularPayment[];
  /** Spending categories in this chunk */
  categories: Category[];
  /** Balance points in this chunk */
  balanceTrend: BalancePoint[];
  /** Metadata for this chunk */
  metadata: StatementMetadata;
} 