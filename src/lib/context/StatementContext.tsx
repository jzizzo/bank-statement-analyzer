/**
 * React context for managing bank statement data throughout the application.
 * This context provides a centralized state management solution for statement data,
 * loading states, and related operations.
 */

'use client';

import { createContext } from 'react';
import { ProcessedStatement } from '../types';

/**
 * Type definition for the StatementContext.
 * Defines the shape of the context data and available operations.
 */
export interface StatementContextType {
  /** The currently processed statement data, or null if no data is available */
  data: ProcessedStatement | null;
  /** Whether the application is currently loading statement data */
  isLoading: boolean;
  /** Function to update the statement data */
  setStatementData: (data: ProcessedStatement) => void;
  /** Function to clear the current statement data */
  clearStatementData: () => void;
  /** Function to update the loading state */
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * React context for statement data management.
 * Used to provide statement data and operations throughout the application.
 */
export const StatementContext = createContext<StatementContextType | undefined>(undefined); 