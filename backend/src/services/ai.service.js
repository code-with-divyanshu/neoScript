const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Summarize the following blog content into a professional, engaging 2-3 sentence summary for a meta description: ${content}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("AI Summary Error", error.message);
    return "";
  }
};

const getWritingSuggestions = async (partialContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are a blog writing assistant.

Task:
- Give only a short writing suggestion.
- Maximum 1-2 sentences.
- Keep it natural and directly useful.
- Do not give multiple options.
- Do not explain.
- Do not output long paragraphs.

User text:
${partialContent}
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Suggestion Error:", error.message);
    return "Keep writing to get suggestions...";
  }
};

module.exports = { generateSummary, getWritingSuggestions };
