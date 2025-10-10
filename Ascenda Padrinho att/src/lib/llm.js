// llm.js — call OpenAI or Gemini directly from the browser (BYO key).
// WARN: For production, use a server/edge proxy. This is MVP only.

export async function generateQuizJSON({ provider, apiKey, prompt }) {
  if (provider === "openai") {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2,
      }),
    });
    const j = await r.json();
    const text = j.output_text ?? j.choices?.[0]?.message?.content ?? "";
    return safeParseJSON(text);
  } else {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
    return safeParseJSON(text);
  }
}

function safeParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    const a = s.indexOf("{");
    const b = s.lastIndexOf("}");
    if (a >= 0 && b > a) return JSON.parse(s.slice(a, b + 1));
    throw new Error("Invalid JSON from LLM");
  }
}
