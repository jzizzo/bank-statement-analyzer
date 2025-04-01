import { ProcessedStatement } from "../lib/types";

interface LoanRecommendationProps {
  data: ProcessedStatement;
}

export default function LoanRecommendation({ data }: LoanRecommendationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
  );
} 