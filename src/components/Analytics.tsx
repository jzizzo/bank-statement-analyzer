import { ProcessedStatement } from "../lib/types";
import IncomeExpensesChart from "./charts/IncomeExpensesChart";
import ExpenseBreakdownChart from "./charts/ExpenseBreakdownChart";
import BalanceTrendChart from "./charts/BalanceTrendChart";

interface AnalyticsProps {
  data: ProcessedStatement;
}

export default function Analytics({ data }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${data.summary.totalDeposits.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${data.summary.totalWithdrawals.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Balance</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${data.summary.endingBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <IncomeExpensesChart data={data} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ExpenseBreakdownChart data={data} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Balance Trend</h3>
          <BalanceTrendChart data={data} />
        </div>
      </div>

      {/* Regular Payments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Regular Payments</h3>
        <div className="space-y-4">
          {data.summary.regularPayments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{payment.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1)}
                </p>
              </div>
              <p className="font-semibold">${payment.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 