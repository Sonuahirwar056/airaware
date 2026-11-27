// Serverless function (Vercel). Keeps the API key on the server.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const prompt = (req.body && req.body.prompt) || "";
  if (!prompt || prompt.length > 5000) return res.status(400).json({ error: "Invalid prompt" });
  try {
    let text;
    if (process.env.GEMINI_API_KEY) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Gemini API error");
      text = j.candidates[0].content.parts.map((p) => p.text || "").join("");
    } else if (process.env.ANTHROPIC_API_KEY) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Anthropic API error");
      text = j.content.map((b) => b.text || "").join("");
    } else {
      return res.status(500).json({ error: "No API key configured on the server" });
    }
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
