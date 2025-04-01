/**
 * Provider component for the StatementContext.
 * This component manages the state and operations for bank statement data
 * and provides them to child components through the StatementContext.
 */

'use client';

import { useState, ReactNode } from 'react';
import { StatementContext } from '../context/StatementContext';
import { ProcessedStatement } from '../types';

/**
 * Provider component that wraps the application to provide statement data context.
 * Manages the state for statement data, loading state, and related operations.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped with the context
 * @returns {JSX.Element} Provider component with statement context
 */
export function StatementProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProcessedStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates the statement data in the context.
   * 
   * @param newData - New processed statement data to set
   */
  const setStatementData = (newData: ProcessedStatement) => {
    setData(newData);
  };

  /**
   * Clears the current statement data from the context.
   */
  const clearStatementData = () => {
    setData(null);
  };

  return (
    <StatementContext.Provider value={{ data, isLoading, setStatementData, clearStatementData, setIsLoading }}>
      {children}
    </StatementContext.Provider>
  );
} 