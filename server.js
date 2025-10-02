import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Running");
});

// Translate route
app.get("/translate", async (req, res) => {
  const text = req.query.q;
  const target = req.query.target || "en";

  if (!text) return res.status(400).json({ error: "Query parameter 'q' is required." });

  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: target,
        format: "text",
        alternatives: 3,
        api_key: process.env.LIBRE_API_KEY || ""
      }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
