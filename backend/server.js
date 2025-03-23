const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

let sharedChat = null;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.post("/gemini-career-chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Only create the chat session ONCE
    if (!sharedChat) {
      sharedChat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });
    }

    // Use only the latest user message
    const lastUserMessage = messages[messages.length - 1].text;

    const result = await sharedChat.sendMessage(lastUserMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini Chat Error:", err.message);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

app.post("/gemini-career-structured", async (req, res) => {
  const { job, answers } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
I am currently working as a ${job}. The user shared these preferences:
${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join("\n")}

Please suggest 5 specific career paths that fit these preferences. 
Return only a plain list (one per line), no explanation or numbering.
`;

    const result = await model.generateContent(prompt);
    const lines = result.response.text().split("\n").filter((line) => line.trim());

    res.json({ suggestions: lines });
  } catch (err) {
    console.error("Gemini Structured Error:", err.message);
    res.status(500).json({ error: "Gemini failed to suggest careers." });
  }
});

app.post("/get-upskilling", async (req, res) => {
  const { job, career, disability } = req.body;

  console.log("🔍 Received:", { job, career, disability }); // ✅ Helpful debug

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const adjustedDisability =
  disability && disability.toLowerCase() !== "undefined"
    ? disability
    : "a specific disability";


const prompt = `
You are helping someone with career upskilling. They currently work as a ${job}, but want to become a ${career}.
They have ${adjustedDisability} — so your plan must be tailored for someone with this. Mention the disability in your response, and clearly explain how each course helps someone with it.

Give a reasonable timeframe for that disability and career so spread the learning phases accordingly. DO NOT CHANGE THIS NUMBER, ur timeline MUST be basedon this number.

Give:
- A clear upskilling roadmap with **5 structured phases**
- In each phase, suggest **3 specific courses or learning resources**
- Include platform links (Coursera, Udemy, LinkedIn Learning) if possible
- For each phase, explain how it supports someone with ${adjustedDisability}
- Use bullet points or numbered structure for clarity
- End with: “By the end of this plan, you should be able to…”

also follow this format
**Phase 1: Title (# year)**  
• Course 1 – [link]  
• Course 2 – [link]  
• Course 3 – [link]

**Phase 2: ...**


Keep it concise, encouraging, and actionable.
`;


    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const resources = text
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        name: line,
        link: "#", // You can extract real links if needed later
      }));

    res.json({ resources });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch upskilling recommendations." });
  }
});


let quickChatSession = null; // ✅ store chat globally

app.post("/gemini-quick-chat", async (req, res) => {
  const { messages, career } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Only create the session once
    if (!quickChatSession) {
      quickChatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `The user is interested in becoming a ${career}. Help them by answering each question they ask with 1 short sentence.`,
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: "Got it. I'm ready to help!" }],
          },
        ],
      });
    }

    const userMessage = messages[messages.length - 1].text;

    const result = await quickChatSession.sendMessage(userMessage);
    let reply = result.response.text().trim();

    // Force 1 sentence
    reply = reply.split(".")[0] + ".";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini Quick Chat Error:", err.message);
    res.status(500).json({ error: "Failed to respond." });
  }
});



app.listen(5000, () => console.log("✅ Server running on port 5000"));
