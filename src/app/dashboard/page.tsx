"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IncomeExpensesChart,
  ExpenseBreakdownChart,
  BalanceTrendChart,
} from "../../components/ui/ChartComponents";
import { ProcessedStatement } from "../../lib/types";

export default function Dashboard() {
  const [data, setData] = useState<ProcessedStatement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem("statementData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        localStorage.removeItem("statementData"); // Clear invalid data
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your financial analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Financial Analysis Dashboard</h1>
          <p className="text-red-600 mt-2">
            No statement data found. Please upload bank statements.
          </p>
        </div>
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to upload
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Financial Analysis Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review your bank statement analysis and loan recommendation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="text-2xl font-bold">
            ${data.summary?.totalDeposits?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold">
            ${data.summary?.totalWithdrawals?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500 dark:text-gray-400">
            Balance
          </h3>
          <p className="text-2xl font-bold">
            ${data.summary?.endingBalance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Income vs. Expenses</h2>
          <div className="h-64">
            <IncomeExpensesChart
              income={data.summary?.totalDeposits || 0}
              expenses={data.summary?.totalWithdrawals || 0}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
          <div className="h-64">
            <ExpenseBreakdownChart categories={data.categories || []} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Balance Trend</h2>
        <div className="h-64">
          <BalanceTrendChart data={data.balanceTrend || []} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Loan Recommendation</h2>
        <div
          className={`p-4 ${
            data.loanRecommendation?.approved
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30"
          } rounded-lg`}
        >
          <h3
            className={`text-lg font-semibold ${
              data.loanRecommendation?.approved
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {data.loanRecommendation?.approved
              ? "Recommend Approval"
              : "Not Recommended for Approval"}
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <div className="w-32">Confidence Score:</div>
              <div className="ml-2 w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`${
                    data.loanRecommendation?.approved
                      ? "bg-green-600"
                      : "bg-red-600"
                  } h-2.5 rounded-full`}
                  style={{ width: `${data.loanRecommendation?.score || 0}%` }}
                ></div>
              </div>
              <span className="ml-2 font-semibold">
                {data.loanRecommendation?.score || 0}%
              </span>
            </div>
            <div className="flex">
              <div className="w-32">Max Amount:</div>
              <div className="font-semibold">
                ${data.loanRecommendation?.maxAmount?.toLocaleString() || '0'}
              </div>
            </div>
            <div className="flex">
              <div className="w-32">Reason:</div>
              <div>{data.loanRecommendation?.reason || 'No reason provided'}</div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Key Factors:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Income Stability</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.loanRecommendation?.keyFactors?.incomeStability || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.loanRecommendation?.keyFactors?.incomeStability || 0}%</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Spending Patterns</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.loanRecommendation?.keyFactors?.spendingPatterns || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.loanRecommendation?.keyFactors?.spendingPatterns || 0}%</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Regular Payments</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.loanRecommendation?.keyFactors?.regularPayments || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.loanRecommendation?.keyFactors?.regularPayments || 0}%</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Balance Trend</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.loanRecommendation?.keyFactors?.balanceTrend || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.loanRecommendation?.keyFactors?.balanceTrend || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to upload
        </Link>
      </div>
    </main>
  );
}
