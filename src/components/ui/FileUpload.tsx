"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { RawStatementData } from "../../lib/types";

interface FileUploadProps {
  onAnalysisComplete: (statements: RawStatementData[]) => void;
}

export default function FileUpload({ onAnalysisComplete }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFiles(prev => [...prev, ...acceptedFiles]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (!files.length) return;

    setIsUploading(true);
    setError(null);
    setUploadedCount(0);

    try {
      const statements: RawStatementData[] = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/process-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429) {
            throw new Error('We\'ve reached our API limit for now. Please try again in a few minutes.');
          }
          throw new Error(errorData.error || 'Failed to process PDF');
        }

        const result = await response.json();
        statements.push(result);
        setUploadedCount(prev => prev + 1);
      }

      onAnalysisComplete(statements);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing files. Please try again.");
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        {files.length === 0 ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop your bank statement PDFs here, or click to select files
            </p>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
            >
              Select Files
            </button>
          </>
        ) : (
          <div>
            <div className="space-y-2 mb-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    disabled={isUploading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                disabled={isUploading}
              >
                Clear All
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                disabled={isUploading}
              >
                {isUploading ? `Processing... (${uploadedCount}/${files.length})` : "Upload All"}
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
