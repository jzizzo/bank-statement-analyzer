/**
 * API route for analyzing bank statements using GPT-4.
 * This endpoint performs intelligent analysis of bank statement data to generate
 * insights, categorize transactions, and provide loan recommendations.
 */

import { NextResponse } from "next/server";
import { openaiClient } from "../../../lib/openaiClient";
import { RawStatementData, ProcessedStatement } from "../../../lib/types";

/**
 * POST endpoint that analyzes bank statement data using GPT-4.
 * 
 * @route POST /api/analyze-statements
 * @param {Request} request - The incoming request containing the statement data
 * @returns {Promise<NextResponse>} Response containing the analysis results or error message
 * 
 * @throws {400} If no statements are provided or if statement structure is invalid
 * @throws {400} If statements have inconsistent currencies
 * @throws {500} If analysis fails
 */
export async function POST(request: Request) {
  try {
    const { statements } = await request.json();
    console.log('Received statements:', JSON.stringify(statements, null, 2));

    if (!Array.isArray(statements) || statements.length === 0) {
      console.error('Invalid statements array:', statements);
      return NextResponse.json(
        { error: "No statements provided" },
        { status: 400 }
      );
    }

    // Validate each statement has the required structure
    const invalidStatements = statements.filter((statement: RawStatementData) => 
      !validateRawStatementData(statement)
    );

    if (invalidStatements.length > 0) {
      console.error('Invalid statement structure:', invalidStatements);
      return NextResponse.json(
        { error: "Invalid statement structure" },
        { status: 400 }
      );
    }

    // Validate currency consistency
    const firstCurrency = statements[0].metadata.currency;
    const hasInconsistentCurrency = statements.some(
      statement => statement.metadata.currency !== firstCurrency
    );

    if (hasInconsistentCurrency) {
      console.error('Inconsistent currencies detected');
      return NextResponse.json(
        { error: "All statements must be in the same currency for analysis" },
        { status: 400 }
      );
    }

    // Combine all statements into a single analysis
    const combinedStatement: RawStatementData = {
      regularPayments: statements.flatMap(s => s.regularPayments),
      categories: statements[0].categories,
      balanceTrend: statements[0].balanceTrend,
      metadata: {
        ...statements[0].metadata,
        currency: firstCurrency
      }
    };

    // Prepare the data for GPT analysis
    const analysisPrompt = `Analyze these bank statements and provide a comprehensive loan recommendation. All monetary values are in ${firstCurrency}. Consider:

1. Income Stability:
   - Regular deposits
   - Income consistency
   - Deposit amounts

2. Spending Patterns:
   - Expense categories
   - Regular payments
   - Spending trends

3. Account Health:
   - Balance trends
   - Overdraft frequency
   - Account activity

4. Regular Payments:
   - Recurring expenses
   - Payment reliability
   - Payment amounts

Statements Data:
${JSON.stringify(combinedStatement, null, 2)}

Return a JSON object with:
{
  "summary": {
    "totalDeposits": number,
    "totalWithdrawals": number,
    "endingBalance": number,
    "regularPayments": [
      {
        "description": string,
        "amount": number,
        "frequency": "monthly" | "weekly" | "quarterly"
      }
    ]
  },
  "categories": [
    {
      "name": string,
      "value": number,
      "color": string
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

IMPORTANT: Return ONLY the JSON object, without any markdown formatting, code blocks, or additional text.`;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst specializing in loan approval decisions. Analyze bank statements and provide detailed recommendations based on financial patterns and stability. Return only valid JSON without any additional formatting."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 4096,
      temperature: 0.1,
    });

    let content = completion.choices[0].message.content || '{}';
    console.log('Raw GPT response:', content);
    
    // Clean the content by removing markdown code blocks and other formatting
    content = content
      .replace(/```json\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/`/g, '')
      .trim();

    console.log('Cleaned GPT response:', content);

    try {
      const result = JSON.parse(content);
      console.log('Parsed result:', JSON.stringify(result, null, 2));

      // Validate the result structure
      if (!result.summary || !result.categories || !result.balanceTrend || !result.loanRecommendation || !result.metadata) {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response format from GPT');
      }

      // Transform the data to match our ProcessedStatement type
      const processedStatement: ProcessedStatement = {
        statements: statements,
        summary: result.summary,
        categories: result.categories,
        balanceTrend: result.balanceTrend,
        loanRecommendation: result.loanRecommendation,
        metadata: result.metadata
      };

      return NextResponse.json(processedStatement);
    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError);
      console.error('Content that failed to parse:', content);
      throw new Error('Failed to parse GPT response');
    }
  } catch (error) {
    console.error("Error analyzing statements:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze statements" },
      { status: 500 }
    );
  }
}

/**
 * Validates that the provided data matches the RawStatementData structure.
 * 
 * @param data - The data to validate
 * @returns True if the data matches the RawStatementData structure
 */
function validateRawStatementData(data: any): data is RawStatementData {
  return (
    data &&
    Array.isArray(data.regularPayments) &&
    data.regularPayments.every((rp: any) =>
      typeof rp.description === "string" &&
      typeof rp.amount === "number" &&
      typeof rp.frequency === "string"
    ) &&
    Array.isArray(data.categories) &&
    data.categories.every((cat: any) =>
      typeof cat.name === "string" &&
      typeof cat.value === "number" &&
      typeof cat.color === "string"
    ) &&
    Array.isArray(data.balanceTrend) &&
    data.balanceTrend.every((bt: any) =>
      typeof bt.date === "string" &&
      typeof bt.balance === "number"
    ) &&
    data.metadata &&
    typeof data.metadata.bankName === "string" &&
    typeof data.metadata.accountHolder === "string" &&
    data.metadata.statementPeriod &&
    typeof data.metadata.statementPeriod.start === "string" &&
    typeof data.metadata.statementPeriod.end === "string"
  );
}
