const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post("/chat", async (req, res) => {
  try {
    console.log("API KEY LOADED:", !!process.env.GEMINI_API_KEY);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: "API key not loaded" });
    }

    const userMessage = req.body.message;

   const apiUrl =
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;


    const payload = {
      contents: [
        { role: "user", parts: [{ text: userMessage }] }
      ]
    };

    const response = await axios.post(apiUrl, payload);

    console.log("Gemini raw response OK");

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text
      || "No response from Gemini";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini FAIL:", err.response?.data || err.message);
    res.json({ reply: "Gemini API failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
