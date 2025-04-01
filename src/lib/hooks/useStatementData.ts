'use client';

import { useContext } from 'react';
import { StatementContext, StatementContextType } from '@/lib/context/StatementContext';

/**
 * Custom hook to access the StatementContext.
 * Provides access to statement data, loading state, and related operations.
 * 
 * @returns {StatementContextType} The statement context containing data, loading state, and operations
 * @throws {Error} If used outside of StatementProvider
 */
export function useStatementData(): StatementContextType {
  const context = useContext(StatementContext);
  if (context === undefined) {
    throw new Error(
      'useStatementData must be used within a StatementProvider. ' +
      'Please ensure the component is wrapped with StatementProvider.'
    );
  }
  return context;
} 