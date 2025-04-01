import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // For MVP, we'll just return mock data
    // In a real implementation, we'd parse the PDF and extract meaningful data
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
      ],
      summary: {
        totalDeposits: 2500.0,
        totalWithdrawals: 1278.45,
        endingBalance: 1221.55,
      },
    };

    // In a real implementation, we would now use OpenAI to analyze the statement

    return NextResponse.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
