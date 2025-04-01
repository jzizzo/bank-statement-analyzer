import { Metadata } from "next";
import Link from "next/link";

import FileUpload from "../components/ui/FileUpload";

export const metadata: Metadata = {
  title: "Bank Statement Analyzer",
  description: "AI-powered bank statement analysis for loan decisions",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-6">Bank Statement Analyzer</h1>
      </div>

      <div className="w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Bank Statement</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Upload a bank statement PDF to analyze financial patterns and
            generate insights for loan decisions.
          </p>

          {/* We'll add the file upload component here */}
          <FileUpload />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Upload</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Upload your bank statement to begin analysis.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Analyze</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Our AI extracts and categorizes all transactions.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Decide</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Get loan recommendations based on financial patterns.
          </p>
        </div>
      </div>
    </main>
  );
}
