import { GoogleGenAI } from "@google/genai";
import { PatentGroup } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generatePortfolioInsight = async (groups: PatentGroup[]): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Prepare a summary for the prompt to save tokens
  const summary = groups.map(g => `${g.countryCode}: ${g.patents.length} patents`).join(', ');

  const prompt = `
    You are an expert Patent Analyst. I have a dataset of patent application numbers grouped by country code.
    
    Here is the distribution summary:
    ${summary}

    Please provide a brief, professional "Market Insight Report" (approx 150 words) based on this geographical distribution. 
    Highlight the top 3 regions and suggest what this implies about the company's IP strategy (e.g., focusing on Asian markets, US-centric, or global expansion).
    Format the output in Markdown using bullet points for key insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate insight.");
  }
};