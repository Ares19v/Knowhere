import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Repository } from "../store";

export const autoOrganizeRepos = async (
  uncategorizedRepos: Repository[], 
  availableCategories: string[],
  geminiApiKey: string
): Promise<{ id: number, category: string }[]> => {
  if (!geminiApiKey) throw new Error("No Gemini API key provided");
  
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  
  // Create a minimal version of repos to send to API to save tokens
  const payload = uncategorizedRepos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    topics: repo.topics
  }));

  // Create schema for structured output (if model supports it, otherwise prompt engineering)
  // We will use standard prompt engineering with JSON response instructions for broad compatibility.
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert GitHub repository organizer. 
    Categorize the following list of repositories into EXACTLY ONE of these available categories:
    [${availableCategories.join(', ')}]

    If none fit perfectly, pick the closest one or "Uncategorized".
    "Frontend" usually means HTML/CSS/JS/React/Vue.
    "Backend" usually means Node, Python, Java, Go, databases, APIs.
    "AI/ML" usually means Python, Jupyter Notebooks, PyTorch, TensorFlow, LLMs, AI.
    "Weekend Projects" can be small random things.

    Repositories:
    ${JSON.stringify(payload, null, 2)}

    Respond with ONLY a valid JSON array of objects, where each object has "id" (number) and "category" (string matching exactly from the list). No markdown, no backticks, just the raw JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up potential markdown formatting from the response
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanedText);
    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
