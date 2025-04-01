/**
 * OpenAI client configuration for the bank statement analyzer.
 * This module initializes the OpenAI client with the API key from environment variables
 * and exports it for use throughout the application.
 */

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

/**
 * Configured OpenAI client instance for making API calls.
 * Used for analyzing bank statements and generating insights.
 * 
 * @throws {Error} If OPENAI_API_KEY environment variable is not set
 */
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 