'use client';

import { useContext } from 'react';
import { StatementContext, StatementContextType } from '@/lib/context/StatementContext';

export function useStatementData(): StatementContextType {
  const context = useContext(StatementContext);
  if (context === undefined) {
    throw new Error('useStatementData must be used within a StatementProvider');
  }
  return context;
} 