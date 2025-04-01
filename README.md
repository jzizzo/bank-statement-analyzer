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


## License

This project is licensed under the MIT License - see the LICENSE file for details.
