import * as pdfjsLib from "pdfjs-dist";
import { RawStatementData, ProcessedStatement } from "../types";
import { openaiClient } from "../openaiClient";
import { chartColors } from "../config/colors";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

// Helper function to chunk text into smaller pieces
function chunkText(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by newlines to preserve transaction boundaries
  const lines = text.split("\n");

  for (const line of lines) {
    // If adding this line would exceed the chunk size, start a new chunk
    if ((currentChunk + line).length > maxChunkSize) {
      // Only add the chunk if it's not empty
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? "\n" : "") + line;
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Helper function to merge results from multiple chunks
function mergeResults(results: any[]): ProcessedStatement {
  const merged: ProcessedStatement = {
    statements: [],
    summary: {
      totalDeposits: 0,
      totalWithdrawals: 0,
      endingBalance: 0,
      regularPayments: [],
    },
    categories: [],
    balanceTrend: [],
    loanRecommendation: {
      approved: false,
      score: 0,
      maxAmount: 0,
      reason: "Insufficient data",
      keyFactors: {
        incomeStability: 0,
        spendingPatterns: 0,
        regularPayments: 0,
        balanceTrend: 0,
      },
    },
    metadata: {
      bankName: "Unknown",
      accountHolder: "Unknown",
      currency: "USD",
      statementPeriod: {
        start: "Unknown",
        end: "Unknown",
      },
    },
  };

  // Track if we have any partial results
  let hasPartialResults = false;

  // Collect raw statements
  results.forEach((result) => {
    if (result.regularPayments) {
      merged.statements.push({
        regularPayments: result.regularPayments || [],
        categories: result.categories || [],
        balanceTrend: result.balanceTrend || [],
        metadata: {
          bankName: result.metadata?.bankName || "Unknown",
          accountHolder: result.metadata?.accountHolder || "Unknown",
          currency: result.metadata?.currency || "USD",
          statementPeriod: {
            start: result.metadata?.statementPeriod?.start || "Unknown",
            end: result.metadata?.statementPeriod?.end || "Unknown",
          },
        },
      });
    }
  });

  // Merge summaries and regular payments
  const regularPaymentsMap = new Map();
  results.forEach((result) => {
    if (result.summary) {
      merged.summary.totalDeposits += result.summary.totalDeposits || 0;
      merged.summary.totalWithdrawals += result.summary.totalWithdrawals || 0;
      merged.summary.endingBalance = result.summary.endingBalance || 0;

      // Merge regular payments
      if (result.summary.regularPayments) {
        result.summary.regularPayments.forEach((payment: any) => {
          const key = `${payment.description}-${payment.amount}-${payment.frequency}`;
          if (!regularPaymentsMap.has(key)) {
            regularPaymentsMap.set(key, payment);
          }
        });
      }
    }
    if (result.partial) {
      hasPartialResults = true;
    }
  });

  merged.summary.regularPayments = Array.from(regularPaymentsMap.values());

  // Merge categories
  const categoryMap = new Map();

  results.forEach((result) => {
    if (result.categories) {
      result.categories.forEach((category: any) => {
        if (!categoryMap.has(category.name)) {
          categoryMap.set(category.name, {
            name: category.name,
            value: category.value || 0,
          });
        } else {
          const existing = categoryMap.get(category.name);
          existing.value += category.value || 0;
        }
      });
    }
  });

  // Convert to array and sort by value
  let categories = Array.from(categoryMap.values()).sort(
    (a, b) => b.value - a.value
  );

  // Take top 8 categories and group the rest into "Other"
  if (categories.length > 9) {
    const topCategories = categories.slice(0, 8);
    const otherCategories = categories.slice(8);
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.value, 0);

    categories = [
      ...topCategories,
      {
        name: "Other",
        value: otherTotal,
      },
    ];
  }

  // Assign colors based on index
  merged.categories = categories.map((category, index) => ({
    ...category,
    color: chartColors[index],
  }));

  // Merge and sort balance trends
  const trendMap = new Map();
  results.forEach((result) => {
    if (result.balanceTrend) {
      result.balanceTrend.forEach((trend: any) => {
        if (!trendMap.has(trend.date)) {
          trendMap.set(trend.date, trend);
        }
      });
    }
  });
  merged.balanceTrend = Array.from(trendMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Use the best loan recommendation with key factors
  let bestScore = 0;
  results.forEach((result) => {
    if (
      result.loanRecommendation &&
      result.loanRecommendation.score > bestScore
    ) {
      bestScore = result.loanRecommendation.score;
      merged.loanRecommendation = {
        ...result.loanRecommendation,
        keyFactors: result.loanRecommendation.keyFactors || {
          incomeStability: 0,
          spendingPatterns: 0,
          regularPayments: 0,
          balanceTrend: 0,
        },
      };
    }
  });

  // Use the most complete metadata
  results.forEach((result) => {
    if (result.metadata) {
      if (result.metadata.bankName && result.metadata.bankName !== "Unknown") {
        merged.metadata.bankName = result.metadata.bankName;
      }
      if (
        result.metadata.accountHolder &&
        result.metadata.accountHolder !== "Unknown"
      ) {
        merged.metadata.accountHolder = result.metadata.accountHolder;
      }
      if (result.metadata.currency && result.metadata.currency !== "USD") {
        merged.metadata.currency = result.metadata.currency;
      }
      if (
        result.metadata.statementPeriod?.start &&
        result.metadata.statementPeriod.start !== "Unknown"
      ) {
        merged.metadata.statementPeriod.start =
          result.metadata.statementPeriod.start;
      }
      if (
        result.metadata.statementPeriod?.end &&
        result.metadata.statementPeriod.end !== "Unknown"
      ) {
        merged.metadata.statementPeriod.end =
          result.metadata.statementPeriod.end;
      }
    }
  });

  // If we have partial results, update the loan recommendation reason
  if (hasPartialResults) {
    merged.loanRecommendation.reason +=
      " (Analysis based on partial statement data)";
  }

  return merged;
}

function validateStatementData(data: RawStatementData): {
  isValid: boolean;
  error?: string;
} {
  // Check for required metadata
  if (!data.metadata?.bankName || !data.metadata?.accountHolder) {
    return { isValid: false, error: "Missing required metadata" };
  }

  // Check for required regular payments
  if (!data.regularPayments || !Array.isArray(data.regularPayments)) {
    return { isValid: false, error: "Missing regular payments data" };
  }

  // Check for required categories
  if (!data.categories || !Array.isArray(data.categories)) {
    return { isValid: false, error: "Missing categories data" };
  }

  // Check for required balance trend
  if (!data.balanceTrend || !Array.isArray(data.balanceTrend)) {
    return { isValid: false, error: "Missing balance trend data" };
  }

  return { isValid: true };
}

export async function processPDFText(buffer: Buffer) {
  try {
    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    // Log the extracted text for debugging
    console.log("Extracted text length:", fullText.length);
    console.log("First 500 characters:", fullText.substring(0, 500));

    // Process the text with GPT
    const result = await processPDFWithGPT4(fullText);

    // Log the GPT result for debugging
    console.log("GPT result:", JSON.stringify(result, null, 2));

    // Convert ProcessedStatement to RawStatementData
    const rawStatement: RawStatementData = {
      regularPayments:
        result.statements?.[0]?.regularPayments ||
        result.summary?.regularPayments ||
        [],
      categories: result.statements?.[0]?.categories || result.categories || [],
      balanceTrend:
        result.statements?.[0]?.balanceTrend || result.balanceTrend || [],
      metadata: {
        bankName:
          result.statements?.[0]?.metadata?.bankName ||
          result.metadata?.bankName ||
          "Unknown",
        accountHolder:
          result.statements?.[0]?.metadata?.accountHolder ||
          result.metadata?.accountHolder ||
          "Unknown",
        currency:
          result.statements?.[0]?.metadata?.currency ||
          result.metadata?.currency ||
          "USD",
        statementPeriod: {
          start:
            result.statements?.[0]?.metadata?.statementPeriod?.start ||
            result.metadata?.statementPeriod?.start ||
            "",
          end:
            result.statements?.[0]?.metadata?.statementPeriod?.end ||
            result.metadata?.statementPeriod?.end ||
            "",
        },
      },
    };

    // Log the raw statement for debugging
    console.log("Raw statement:", JSON.stringify(rawStatement, null, 2));

    // Validate the raw statement data
    const validation = validateStatementData(rawStatement);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid statement data");
    }

    return rawStatement;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}

export async function processPDFWithGPT4(
  pdfText: string
): Promise<ProcessedStatement> {
  try {
    // Split text into chunks
    const chunks = chunkText(pdfText);
    const results = [];

    // Process each chunk
    for (const chunk of chunks) {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a financial analyst specializing in bank statement analysis. Extract key financial metrics and provide loan recommendations based on spending patterns and income stability. Return data in a clean JSON format with no additional text or formatting.",
          },
          {
            role: "user",
            content: `Analyze this bank statement text and return ONLY the following key metrics in JSON format:

{
  "statements": [
    {
      "regularPayments": [
        {
          "description": "string",
          "amount": number,
          "frequency": "monthly" | "weekly" | "quarterly"
        }
      ],
      "categories": [
        {
          "name": string,
          "value": number
        }
      ],
      "balanceTrend": [
        {
          "date": "YYYY-MM-DD",
          "balance": number
        }
      ],
      "metadata": {
        "bankName": string,
        "accountHolder": string,
        "currency": string,
        "statementPeriod": {
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD"
        }
      }
    }
  ],
  "summary": {
    "totalDeposits": number,
    "totalWithdrawals": number,
    "endingBalance": number,
    "regularPayments": [
      {
        "description": "string",
        "amount": number,
        "frequency": "monthly" | "weekly" | "quarterly"
      }
    ]
  },
  "categories": [
    {
      "name": string,
      "value": number
    }
  ],
  "balanceTrend": [
    {
      "date": "YYYY-MM-DD",
      "balance": number
    }
  ],
  "loanRecommendation": {
    "approved": boolean,
    "score": number,
    "maxAmount": number,
    "reason": string,
    "keyFactors": {
      "incomeStability": number,
      "spendingPatterns": number,
      "regularPayments": number,
      "balanceTrend": number
    }
  },
  "metadata": {
    "bankName": string,
    "accountHolder": string,
    "currency": string,
    "statementPeriod": {
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD"
    }
  }
}

Key requirements:
1. Focus on identifying regular payments and their frequencies
2. Calculate total deposits and withdrawals
3. Group expenses into meaningful categories (e.g., Utilities, Food, Transport)
4. Track balance trend over time (monthly points)
5. Assess loan eligibility based on:
   - Income stability (0-100 score)
   - Spending patterns (0-100 score)
   - Regular payments (0-100 score)
   - Account balance trend (0-100 score)
6. Return ONLY the JSON object with no formatting
7. Ensure all numbers are valid JSON numbers (no commas)
8. Detect and specify the currency (USD, GBP, AUD, INR, etc.) based on statement format

Here's the bank statement text:

${chunk}`,
          },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      });

      let result;
      let cleanContent = "";
      try {
        const content = completion.choices[0].message.content || "{}";
        // Clean the content more thoroughly
        cleanContent = content
          .replace(/```json\n?|\n?```/g, "")
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\u2028|\u2029/g, "\n")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
          .replace(/,(\s*[}\]])/g, "$1")
          // Fix numbers with multiple decimal points
          .replace(/"balance":\s*(\d+\.\d+\.\d+)/g, (match, num) => {
            // Remove all decimal points except the last one
            const parts = num.split(".");
            return `"balance": ${parts[0]}.${parts.slice(1).join("")}`;
          })
          // Fix numbers with commas
          .replace(/(\d+),(\d{3})/g, "$1$2")
          .trim();

        result = JSON.parse(cleanContent);

        // Ensure required fields exist with default values
        result.statements = result.statements || [];
        result.summary = result.summary || {};
        result.summary.totalDeposits = result.summary.totalDeposits || 0;
        result.summary.totalWithdrawals = result.summary.totalWithdrawals || 0;
        result.summary.endingBalance = result.summary.endingBalance || 0;
        result.categories = result.categories || [];
        result.balanceTrend = result.balanceTrend || [];
        result.loanRecommendation = result.loanRecommendation || {
          approved: false,
          score: 0,
          maxAmount: 0,
          reason: "Insufficient data",
        };
        result.metadata = result.metadata || {
          bankName: "Unknown",
          accountHolder: "Unknown",
          currency: "USD",
          statementPeriod: {
            start: "",
            end: "",
          },
        };
      } catch (parseError) {
        console.error("Error parsing GPT response:", parseError);
        console.error("Raw response:", completion.choices[0].message.content);
        console.error("Cleaned content length:", cleanContent.length);
        throw new Error("Failed to parse GPT response as JSON");
      }

      // Validate the result structure
      if (
        !result.statements ||
        !result.summary ||
        !result.categories ||
        !result.balanceTrend ||
        !result.loanRecommendation ||
        !result.metadata
      ) {
        console.error("Invalid response structure:", result);
        throw new Error("Invalid response format from GPT-4");
      }

      results.push(result);
    }

    // Merge results from all chunks
    return mergeResults(results);
  } catch (error) {
    console.error("Error processing PDF text:", error);
    throw error;
  }
}
