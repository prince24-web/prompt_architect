import { GoogleGenAI } from "@google/genai";

// The template from the user's Python script
const PROMPT_TEMPLATE = `
{
  "meta": {
    "project_name": "Lumina_Bookstore",
    "version": "1.0",
    "intent": "Generate a single-file React application for a comprehensive online book shop."
  },
  "system_instruction": {
    "role": "Senior Frontend Architect",
    "tone": "Professional, Code-Focused, Aesthetic",
    "framework": "React (Single File with Tailwind CSS)",
    "icons": "Lucide-React"
  },
  "core_requirements": {
    "structure": "Single file (.tsx) containing all components, logic, and styles.",
    "responsiveness": "Mobile-first, fully responsive layout using Tailwind CSS utility classes.",
    "state_management": "React Hooks (useState, useEffect, useMemo) for cart, filtering, and UI state.",
    "persistence": "Use localStorage to persist the shopping cart between sessions."
  },
  "features": [
    {
      "name": "Navigation_Header",
      "details": "Sticky header with logo, search bar (real-time filtering), category links, and a dynamic cart icon badge showing item count."
    },
    {
      "name": "Hero_Section",
      "details": "Immersive banner with a 'Featured Book of the Month', including a call-to-action button and high-quality background styling."
    },
    {
      "name": "Book_Catalog",
      "details": "Grid layout of book cards. Each card must show: Cover image (use high-quality placeholders), Title, Author, Price, Rating (stars), and an 'Add to Cart' button."
    },
    {
      "name": "Category_Filter",
      "details": "Sidebar or top bar filters for genres (Fiction, Non-Fiction, Sci-Fi, Mystery, Self-Help)."
    },
    {
      "name": "Detailed_Book_View",
      "details": "A modal or separate view overlay that opens when a book is clicked, showing the synopsis, extended details (ISBN, pages), and reviews."
    },
    {
      "name": "Shopping_Cart_Drawer",
      "details": "Slide-out drawer logic. Users can increase/decrease quantity or remove items. Includes a subtotal calculation and a 'Checkout' button."
    },
    {
      "name": "Checkout_Simulation",
      "details": "A multi-step mock checkout form (Shipping Info -> Payment -> Confirmation) with form validation."
    }
  ],
  "data_model": {
    "books_array": "Must include at least 12 mock items with diverse genres.",
    "book_object_schema": {
      "id": "integer",
      "title": "string",
      "author": "string",
      "price": "float",
      "genre": "string",
      "rating": "float (1-5)",
      "coverUrl": "string (use placeholders like picsum.photos)",
      "description": "string"
    }
  },
  "ui_ux_guidelines": {
    "color_palette": {
      "primary": "Amber-600 (warm, paper-like feel)",
      "secondary": "Slate-900 (for text and contrast)",
      "background": "Stone-50 (off-white for readability)"
    },
    "typography": {
      "headings": "Serif font family",
      "body": "Sans-serif for UI elements"
    },
    "interactions": "Hover effects on book cards (slight lift), smooth transitions for modals and cart drawer."
  },
  "execution_steps": [
    "1. Define the 'books' constant with rich mock data.",
    "2. Create the 'App' component layout (Header, Main, Footer).",
    "3. Implement the 'BookCard' and 'CartItem' components.",
    "4. Implement the 'useCart' hook logic.",
    "5. Assemble the 'Checkout' modal logic.",
    "6. Apply final Tailwind polish for spacing and shadows."
  ]
}
`;

const SYSTEM_INSTRUCTION = `You are an AI assistant whose job is to enhance user prompts and produce a highly detailed JSON prompt following a strict schema.

### EXAMPLE
Input: "give me a website for an online book shop"

Output:
${PROMPT_TEMPLATE}

### INSTRUCTIONS
1. Analyze the user's request.
2. Extrapolate necessary features, data models, and UI/UX guidelines to make the application world-class.
3. Output ONLY valid JSON matching the structure of the example.
4. Do not wrap the JSON in markdown code blocks (e.g., \`\`\`json). Return raw JSON string only.
`;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const enhancePrompt = async (userPrompt: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // Clean up potential markdown formatting if the model disobeys instructions
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return cleanText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to enhance prompt. Please check your API key and try again.");
  }
};