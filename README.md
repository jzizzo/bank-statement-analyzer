# Bank Statement Analyzer

An intelligent system that analyzes bank statements to provide loan recommendations and financial insights. Built with Next.js and powered by OpenAI's GPT-3.5.

## Overview

This application solves the challenge of manually analyzing bank statements for loan decisions by providing an automated, AI-powered solution. It processes multiple bank statements to:

- Extract and categorize transactions
- Identify regular payments and recurring expenses
- Analyze balance trends and account health
- Generate comprehensive loan recommendations
- Provide detailed financial insights

## Features

- 📄 **Multi-Statement Analysis**: Process multiple bank statements simultaneously
- 🤖 **AI-Powered Analysis**: Leverages GPT-3.5 for intelligent financial pattern recognition
- 📊 **Visual Analytics**: Interactive charts and graphs for financial data visualization
- 💰 **Loan Recommendations**: Detailed loan approval decisions with scoring and reasoning
- 🔍 **Regular Payment Detection**: Identifies recurring expenses and payment patterns
- 📈 **Balance Trend Analysis**: Tracks account balance changes over time

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **AI**: OpenAI GPT-3.5
- **UI**: Modern React components with Tailwind CSS
- **Data Processing**: PDF parsing and financial data analysis

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd bank-statement-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload one or more bank statement PDFs
2. Wait for the AI to analyze the statements
3. View the comprehensive analysis in the dashboard
4. Review the loan recommendation and financial insights

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/lib` - Utilities, types, and configurations
- `/src/types` - TypeScript type definitions

## API Endpoints

- `/api/process-pdf` - Processes uploaded PDF statements
- `/api/analyze-statements` - Analyzes processed statements and generates insights

## Key Design Decisions

### MVP Scope and Simplifications
- **No Database Persistence**: For the MVP, we focused on immediate analysis without data persistence, as the primary goal is to demonstrate the value of automated analysis.
- **Multi-Statement Support**: Added support for processing multiple bank statements simultaneously, addressing the real-world scenario of analyzing multiple clients.
- **Robust PDF Validation**: Implemented comprehensive validation for PDFs, including:
  - Account holder name verification
  - Currency consistency checks across multiple statements
  - Format and content validation

### Architecture Decisions
- **Separated PDF Processing and Analysis**: Split the analysis into two distinct GPT-4 calls:
  1. PDF Text Extraction and Initial Processing
  2. Loan Recommendation Analysis
  This separation of concerns provides better error handling, clearer processing stages, and the ability to retry failed steps independently.

- **PDF Chunking Strategy**: Implemented intelligent PDF chunking to handle large bank statements:
  - Splits large statements into manageable chunks while preserving transaction boundaries
  - Ensures no transaction data is split across chunks
  - Merges results from multiple chunks into a coherent analysis
  - Handles API token limits efficiently
  - Maintains data integrity across chunk boundaries

### Future Iterations
- **Data Persistence**: Add database support for storing analysis history and client information
- **Batch Processing**: Implement queue-based processing for large volumes of statements
- **Enhanced Validation**: Add support for more bank statement formats and additional validation rules
- **Machine Learning Models**: Train custom models for specific aspects of analysis
- **API Integration**: Add support for direct bank API connections
- **Advanced Analytics**: Implement more sophisticated financial metrics and trend analysis

## Loan Recommendation Analysis Process

The loan recommendation analysis follows a structured process to evaluate the applicant's financial health:

1. **Income Analysis**
   - Calculate total monthly deposits
   - Identify regular income sources
   - Assess income stability and consistency

2. **Expense Analysis**
   - Categorize all transactions
   - Identify and analyze regular payments
   - Calculate total monthly withdrawals
   - Detect potential loan payments

3. **Balance Trend Analysis**
   - Track account balance changes over time
   - Identify patterns in balance fluctuations
   - Assess overall account health

4. **Key Factor Scoring**
   - Income Stability (0-100)
   - Spending Patterns (0-100)
   - Regular Payment History (0-100)
   - Balance Trend (0-100)

5. **Loan Decision**
   - Calculate overall credit score
   - Determine maximum recommended loan amount
   - Generate detailed reasoning for the decision
   - Provide key factors influencing the recommendation

The final recommendation includes a comprehensive analysis of these factors, providing both a clear decision and detailed reasoning to support the loan officer's decision-making process.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
