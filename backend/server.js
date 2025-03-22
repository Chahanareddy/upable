const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

app.listen(5000, () => console.log("✅ Server running on port 5000"));
