// Updated dashboard/page.tsx to be a client component
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
}

interface Summary {
  totalDeposits: number;
  totalWithdrawals: number;
  endingBalance: number;
}

interface StatementData {
  transactions: Transaction[];
  summary: Summary;
}

export default function Dashboard() {
  const [data, setData] = useState<StatementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem("statementData");
    if (storedData) {
      setData(JSON.parse(storedData));
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
            No statement data found. Please upload a bank statement.
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
            ${data.summary.totalDeposits.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold">
            ${data.summary.totalWithdrawals.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500 dark:text-gray-400">
            Balance
          </h3>
          <p className="text-2xl font-bold">
            ${data.summary.endingBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Income vs. Expenses</h2>
          <div className="h-64 flex items-center justify-center">
            {/* We'll add the chart here later */}
            <div className="text-center">
              <div className="flex justify-center space-x-8">
                <div>
                  <div className="h-40 w-20 bg-green-500 rounded-t-lg"></div>
                  <p className="mt-2">Income</p>
                </div>
                <div>
                  <div className="h-24 w-20 bg-red-500 rounded-t-lg"></div>
                  <p className="mt-2">Expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will appear here
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Loan Recommendation</h2>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
            Recommend Approval
          </h3>
          <p className="mt-2">
            Based on the financial analysis, this applicant shows stable income
            and responsible spending habits. The debt-to-income ratio is within
            acceptable limits.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {data.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {transaction.description}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      transaction.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
