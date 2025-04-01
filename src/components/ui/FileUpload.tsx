"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ProcessedStatement } from "../../lib/types";

interface FileUploadProps {
  onAnalysisComplete: (result: ProcessedStatement) => void;
}

export default function FileUpload({ onAnalysisComplete }: FileUploadProps) {
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
      onAnalysisComplete(result);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing file. Please try again.");
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
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                disabled={isUploading}
              >
                {isUploading ? "Processing..." : "Upload"}
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
