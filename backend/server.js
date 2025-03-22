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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `I currently work as a ${job}, but I want to become a ${career}. I have ${disability} so tailor ur advice for someone with this( mention this in ur response). Suggest certifications courses or learning resources (with links) from platforms like Coursera, Udemy, or LinkedIn Learning make sure to create a plan like a route to succeed in the upskilling like for example "Start this beginner course @..., then do this then this then this...... by the end you should be able to....`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Convert Gemini AI response into a structured format
    const resources = text.split("\n").filter(Boolean).map(item => ({
      name: item,
      link: "#" // Placeholder, replace with real links if needed
    }));

    res.json({ resources });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
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
