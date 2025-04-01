"use client";

import { useRouter } from "next/navigation";
import Analytics from "@/components/Analytics";
import LoanRecommendation from "@/components/LoanRecommendation";
import { useStatementData } from "@/lib/hooks/useStatementData";

export default function Dashboard() {
  const router = useRouter();
  const { data, isLoading, clearStatementData } = useStatementData();

  console.log('Dashboard - Current data:', data);
  console.log('Dashboard - Loading state:', isLoading);

  const handleNewAnalysis = () => {
    console.log('Dashboard - Starting new analysis');
    clearStatementData();
    router.push("/");
  };

  console.log("isLoading", isLoading);

  if (isLoading) {
    console.log('Dashboard - Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    console.log('Dashboard - No data found');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              No Analysis Data Found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please upload your bank statements to get started.
            </p>
            <button
              onClick={handleNewAnalysis}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Dashboard - Rendering with data:', data);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statement Analysis
          </h1>
          <button
            onClick={handleNewAnalysis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Analysis
          </button>
        </div>

        <div className="space-y-8">
          <Analytics data={data} />
          <LoanRecommendation data={data} />
        </div>
      </div>
    </div>
  );
}
