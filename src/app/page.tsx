/**
 * Main page component for the bank statement analyzer application.
 * This component handles the file upload process and orchestrates the analysis pipeline.
 */

"use client";

import { useRouter } from "next/navigation";
import FileUpload from "../components/ui/FileUpload";
import { RawStatementData, ProcessedStatement } from "../lib/types";
import { useState } from "react";
import { useStatementData } from "../lib/hooks/useStatementData";

/**
 * Home component that serves as the main entry point for the application.
 * Handles file upload, statement analysis, and navigation to the dashboard.
 * 
 * @returns JSX.Element The rendered home page component
 */
export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setStatementData, clearStatementData, setIsLoading } = useStatementData();

  /**
   * Handles the completion of statement analysis.
   * Processes the analyzed statements and navigates to the dashboard.
   * 
   * @param statements - Array of analyzed statement data
   * @throws Error if analysis fails or API request fails
   */
  const handleAnalysisComplete = async (statements: RawStatementData[]) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setIsLoading(true);
      
      console.log('handleAnalysisComplete - Starting analysis with statements:', statements);
      
      // Clear any existing data before starting new analysis
      clearStatementData();

      // Send all statements for final analysis
      const response = await fetch("/api/analyze-statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statements }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze statements");
      }

      const result: ProcessedStatement = await response.json();
      console.log('handleAnalysisComplete - Received result:', result);
      
      // Create a properly structured ProcessedStatement object
      const processedData: ProcessedStatement = {
        statements: [{
          regularPayments: result.summary.regularPayments,
          categories: result.categories,
          balanceTrend: result.balanceTrend,
          metadata: result.metadata
        }],
        summary: result.summary,
        categories: result.categories,
        balanceTrend: result.balanceTrend,
        loanRecommendation: result.loanRecommendation,
        metadata: result.metadata
      };

      console.log('handleAnalysisComplete - Setting processed data:', processedData);
      // Set the data using our hook
      setStatementData(processedData);
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error analyzing statements:", error);
      setError(error instanceof Error ? error.message : "Failed to analyze statements");
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-6">Bank Statement Analyzer</h1>
      </div>

      <div className="w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Bank Statements</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Upload multiple bank statement PDFs to analyze financial patterns across time
            and generate insights for loan decisions.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isAnalyzing && (
            <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Analyzing statements... This may take a few minutes.
            </div>
          )}

          <FileUpload onAnalysisComplete={handleAnalysisComplete} />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Upload</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Upload multiple bank statements to begin analysis.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Analyze</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Our AI extracts and categorizes transactions across all statements.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Decide</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Get loan recommendations based on comprehensive financial analysis.
          </p>
        </div>
      </div>
    </main>
  );
}
