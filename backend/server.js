const express = require("express"); 
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

let sharedChat = null;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //api key hidden instead of hardcoded


app.post("/gemini-career-chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Only create the chat session ONCE because if not it's refreshing

    if (!sharedChat) {
      sharedChat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });
    }

    // Only like uses the latest user message
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

    //prompt to suggest the 5 paths for users and u can like click on what u want

    const prompt = `
I am currently working as a ${job}. The user shared these preferences:
${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join("\n")}

Please suggest 5 specific career paths that fit these preferences. 
Return only a plain list (one per line), 1 sentence explanation their role; super precise 10 words.
`;

    const result = await model.generateContent(prompt);

    //breaks the response by space and uses them as like something like different variables to list them
    const lines = result.response.text().split("\n").filter((line) => line.trim()); 

    //errors
    res.json({ suggestions: lines });
  } catch (err) {
    console.error("Gemini Structured Error:", err.message); 
    res.status(500).json({ error: "Gemini failed to suggest careers." });
  }
});

//acc prompt for the results page that generates the phases/modules

app.post("/get-upskilling", async (req, res) => {
  const { job, career, disability } = req.body;
  console.log("🔍 Received:", { job, career, disability }); //Tells you which of the "answer keys" were received in like ur terminal

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const adjustedDisability = disability && disability.toLowerCase() !== "undefined"
      ? disability
      : "a specific disability";

    const prompt = `
You are helping someone with career upskilling. They currently work as a ${job}, but want to become a ${career}.
They have ${adjustedDisability}. Give a clear upskilling roadmap.

Start with 2 sentences describing who the plan is for and why the approach fits them (mention 1 more sentence why this is a good plan for dyslexic people).

Then, provide 5 phases using this format exactly:
**Phase 1: Title (time)**
• Course Name – [link] (short description why its useful for dyslexic ppl) *3 per phase

Only return the initial description + 5 formatted phases. No intro/outro sentences.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    //break it donw by line so we can format it prettier/css is easier

    const descriptionMatch = text.match(/^(.*?\*\*Phase 1:)/s);
    const description = descriptionMatch ? descriptionMatch[1].replace(/\*\*Phase 1:/, "").trim() : "";
    const rest = text.replace(descriptionMatch[1], "**Phase 1:");

    
    //basically breaks it down by lines and makes it like variable and use it to format
    
    const phaseChunks = rest.split("**Phase ").slice(1);
    const phases = phaseChunks.map((chunk) => {
      const [titleLine, ...courseLines] = chunk.split("\n").filter(Boolean);
      const title = `Phase ${titleLine.trim()}`;
      const courses = courseLines.map(line => {
        const match = line.match(/• (.*?) – \[(.*?)\]/);
        return {
          name: match ? match[1] : line,
          link: match ? match[2] : "#"
        };
      });
      return { title, courses };
    });

    //errors if api doesnt work
    res.json({ description, phases });
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
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

    // Forces 1 sentence
    reply = reply.split(".")[0] + ".";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini Quick Chat Error:", err.message);
    res.status(500).json({ error: "Failed to respond." });
  }
});


//this is if the api is working properly
app.listen(5000, () => console.log("✅ Server running on port 5000"));
