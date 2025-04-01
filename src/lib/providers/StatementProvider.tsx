'use client';

import { useState, ReactNode } from 'react';
import { StatementContext } from '../context/StatementContext';
import { ProcessedStatement } from '../types';

export function StatementProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProcessedStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setStatementData = (newData: ProcessedStatement) => {
    setData(newData);
  };

  const clearStatementData = () => {
    setData(null);
  };

  return (
    <StatementContext.Provider value={{ data, isLoading, setStatementData, clearStatementData }}>
      {children}
    </StatementContext.Provider>
  );
} 