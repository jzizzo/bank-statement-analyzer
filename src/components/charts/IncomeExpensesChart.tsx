import { ProcessedStatement } from "../../lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IncomeExpensesChartProps {
  data: ProcessedStatement;
}

export default function IncomeExpensesChart({ data }: IncomeExpensesChartProps) {
  const chartData = [{
    date: new Date(data.metadata.statementPeriod.end).toLocaleDateString(),
    income: data.summary.totalDeposits,
    expenses: data.summary.totalWithdrawals
  }];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            name="Income"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            name="Expenses"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
