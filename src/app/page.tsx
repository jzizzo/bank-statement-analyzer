"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import FileUpload from "../components/ui/FileUpload";
import { RawStatementData, ProcessedStatement } from "../lib/types";

export default function Home() {
  const router = useRouter();

  const handleAnalysisComplete = async (statements: RawStatementData[]) => {
    try {
      // Send all statements for final analysis
      const response = await fetch("/api/analyze-statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statements }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze statements");
      }

      const result: ProcessedStatement = await response.json();
      
      // Save the result to localStorage
      localStorage.setItem("statementData", JSON.stringify(result));
      // Navigate to the dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error analyzing statements:", error);
      // Handle error appropriately
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
