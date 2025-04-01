"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // For our MVP we'll use mock data since we're not implementing the full PDF parsing
      // In a real implementation, we would send the file to our API endpoint

      // Simulating analysis of different bank statements
      const mockData = {
        transactions: [
          {
            date: "2023-01-15",
            description: "DEPOSIT",
            amount: 2500.0,
            type: "credit",
          },
          {
            date: "2023-01-18",
            description: "RENT PAYMENT",
            amount: 1200.0,
            type: "debit",
          },
          {
            date: "2023-01-20",
            description: "GROCERY STORE",
            amount: 78.45,
            type: "debit",
          },
          {
            date: "2023-01-25",
            description: "PAYROLL",
            amount: 2400.0,
            type: "credit",
          },
          {
            date: "2023-01-28",
            description: "UTILITIES",
            amount: 145.3,
            type: "debit",
          },
          {
            date: "2023-01-31",
            description: "ONLINE SHOPPING",
            amount: 89.99,
            type: "debit",
          },
        ],
        summary: {
          totalDeposits: 4900.0,
          totalWithdrawals: 1513.74,
          endingBalance: 3386.26,
        },
        categories: [
          { name: "Housing", value: 60, color: "#3b82f6" },
          { name: "Food", value: 20, color: "#f97316" },
          { name: "Utilities", value: 10, color: "#8b5cf6" },
          { name: "Shopping", value: 10, color: "#10b981" },
        ],
        balanceTrend: [
          { date: "Week 1", balance: 2500.0 },
          { date: "Week 2", balance: 1300.0 },
          { date: "Week 3", balance: 3700.0 },
          { date: "Week 4", balance: 3386.26 },
        ],
        loanRecommendation: {
          approved: true,
          score: 85,
          maxAmount: 25000,
          reason: "Strong income to expense ratio and consistent deposits",
        },
      };

      // Store results in localStorage for now
      localStorage.setItem("statementData", JSON.stringify(mockData));

      setTimeout(() => {
        setIsUploading(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Error processing file. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        {!file ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop your bank statement PDF here, or click to select
              files
            </p>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
            >
              Select File
            </button>
          </>
        ) : (
          <div>
            <p className="text-green-600 dark:text-green-400 mb-2">
              File selected: {file.name}
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Analyze Statement"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
