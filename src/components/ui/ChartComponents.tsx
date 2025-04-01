"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IncomeExpensesProps {
  income: number;
  expenses: number;
}

export function IncomeExpensesChart({ income, expenses }: IncomeExpensesProps) {
  const data = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: expenses },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
        />
        <Bar dataKey="amount" name="Amount">
          <Cell fill="#22c55e" />
          <Cell fill="#ef4444" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ExpenseBreakdownProps {
  categories: CategoryData[];
}

export function ExpenseBreakdownChart({ categories }: ExpenseBreakdownProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={categories}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {categories.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface BalanceTrendProps {
  data: Array<{
    date: string;
    balance: number;
  }>;
}

export function BalanceTrendChart({ data }: BalanceTrendProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
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
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Balance"]}
        />
        <Bar dataKey="balance" name="Balance" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
