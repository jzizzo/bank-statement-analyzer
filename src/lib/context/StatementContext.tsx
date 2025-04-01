'use client';

import { createContext } from 'react';
import { ProcessedStatement } from '../types';

export interface StatementContextType {
  data: ProcessedStatement | null;
  isLoading: boolean;
  setStatementData: (data: ProcessedStatement) => void;
  clearStatementData: () => void;
}

export const StatementContext = createContext<StatementContextType | undefined>(undefined); 