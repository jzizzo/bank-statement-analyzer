// components/ui/FileUpload.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are accepted");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length) {
        onDrop([...e.dataTransfer.files]);
      }
    },
    [onDrop]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        onDrop([...e.target.files]);
      }
    },
    [onDrop]
  );

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // For now, we'll just simulate processing and redirect
      // Later we'll implement actual processing
      console.log(`Processing file: ${file.name}`);

      setTimeout(() => {
        setIsUploading(false);
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Error processing file. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop your bank statement PDF here
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
            >
              Select File
            </label>
          </>
        ) : (
          <div>
            <p className="text-green-600 dark:text-green-400 mb-2">
              File selected: {file.name}
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setFile(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
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
