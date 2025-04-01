import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";
import { RawStatementData, ProcessedStatement } from "../../../lib/types";

export async function POST(request: Request) {
  try {
    const { statements } = await request.json();

    if (!Array.isArray(statements) || statements.length === 0) {
      return NextResponse.json(
        { error: "No statements provided" },
        { status: 400 }
      );
    }

    // Prepare a simplified version of the statements for analysis
    const simplifiedStatements = statements.map(statement => ({
      transactions: statement.transactions.map(t => ({
        date: t.date,
        amount: t.amount,
        type: t.type,
        description: t.description
      })),
      summary: statement.summary,
      categories: statement.categories,
      balanceTrend: statement.balanceTrend
    }));

    // Prepare the data for GPT analysis
    const analysisPrompt = `Analyze these bank statements and provide a comprehensive loan recommendation. Consider:

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
${JSON.stringify(simplifiedStatements, null, 2)}

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
    "statementPeriod": {
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD"
    }
  }
}

IMPORTANT: Return ONLY the JSON object, without any markdown formatting, code blocks, or additional text.`;

    const completion = await openai.chat.completions.create({
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
      max_tokens: 4096, // Increased token limit
      temperature: 0.1,
    });

    let content = completion.choices[0].message.content || '{}';
    
    // Clean the content by removing markdown code blocks and other formatting
    content = content
      .replace(/```json\s*/, '') // Remove opening json code block
      .replace(/```\s*$/, '')    // Remove closing code block
      .replace(/`/g, '')         // Remove any remaining backticks
      .trim();                   // Remove extra whitespace

    console.log('Cleaned GPT response:', content);

    // Try to fix truncated JSON if needed
    if (content.includes('"balanceTrend": [') && !content.endsWith('}')) {
      // Find the last complete balance trend entry
      const lastBalanceMatch = content.match(/"date": "[^"]+",\s*"balance": \d+\.?\d*/g);
      if (lastBalanceMatch) {
        const lastEntry = lastBalanceMatch[lastBalanceMatch.length - 1];
        const lastEntryIndex = content.lastIndexOf(lastEntry);
        if (lastEntryIndex !== -1) {
          // Truncate at the last complete entry and close the JSON properly
          content = content.substring(0, lastEntryIndex + lastEntry.length) + '}]}';
        }
      }
    }

    const result = JSON.parse(content);

    // Validate the result structure
    if (!result.summary || !result.categories || !result.balanceTrend || !result.loanRecommendation || !result.metadata) {
      console.error('Invalid response structure:', result);
      throw new Error('Invalid response format from GPT');
    }

    // Add the raw statements to the result
    const finalResult: ProcessedStatement = {
      ...result,
      statements
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error analyzing statements:", error);
    return NextResponse.json(
      { error: "Failed to analyze statements" },
      { status: 500 }
    );
  }
} 