// QuizGeneratorModal.jsx — generate 20 questions using OpenAI/Gemini
// Supports: YouTube link (as context), paste text, upload PDF/DOCX/TXT
// Stores API key in sessionStorage (MVP only)

import React from "react";
import { extractPdfText } from "../../lib/pdfText";
import { extractDocxText } from "../../lib/docxText";
import { generateQuizJSON } from "../../lib/llm";
import { normalizeTo20 } from "../../lib/normalizeQuiz";
import { QuizMiniPreview } from "./QuizMiniPreview";
import QuizEditor from "./QuizEditor";

export function QuizGeneratorModal({ defaultYoutubeUrl, defaultFiles, defaultText, onClose, onSave }) {
  const [apiProvider, setProvider] = React.useState("openai");
  const [apiKey, setKey] = React.useState(sessionStorage.getItem("ASCENDA_AI_KEY") || "");
  const [youtubeUrl, setYoutubeUrl] = React.useState(defaultYoutubeUrl || "");
  const [text, setText] = React.useState(defaultText || "");
  const [localFiles, setLocalFiles] = React.useState(defaultFiles || []);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [quiz, setQuiz] = React.useState(null); // { easy, intermediate, advanced }

  const handleExtractFromFiles = async () => {
    setError("");
    try {
      let full = text ? text + "\n" : "";
      for (const f of localFiles) {
        if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
          full += (await extractPdfText(f)) + "\n";
        } else if (f.name.endsWith(".docx")) {
          full += (await extractDocxText(f)) + "\n";
        } else if (f.type.startsWith("text/") || f.name.endsWith(".txt")) {
          full += (await f.text()) + "\n";
        }
      }
      setText(full.trim());
    } catch (e) {
      setError("Failed to extract text from files.");
    }
  };

  const buildPrompt = (t) => `
You are an instructional design expert for the system "Ascenda".
Generate EXACTLY 20 multiple-choice questions as valid JSON with this structure:
{
  "easy": [ { "prompt": "...", "options": ["...","...","...","..."], "correctIndex": 0, "explanation": "..." } ],
  "intermediate": [ ... ],
  "advanced": [ ... ]
}
Rules:
- 4 options, exactly 1 correct (use index in "correctIndex").
- easy: definitions/memorization (7 questions).
- intermediate: application (7 questions).
- advanced: analysis/comparison (6 questions).
- Avoid options like "all of the above".
- If the text is insufficient for a level, reduce that level and state why in the first item's "explanation".
- Return ONLY raw JSON (no code fences, no prose).

TEXT:
<<<${t.slice(0, 20000)}>>>`;

  const handleGenerate = async () => {
    setError("");
    if (!apiKey) return setError("Provide your API key.");
    if (!text && !youtubeUrl) return setError("Paste text or add a link with transcript.");

    setLoading(true);
    try {
      sessionStorage.setItem("ASCENDA_AI_KEY", apiKey);
      const header = youtubeUrl ? `Source: ${youtubeUrl}\n\n` : "";
      const prompt = buildPrompt(header + (text || ""));
      const json = await generateQuizJSON({ provider: apiProvider, apiKey, prompt });
      const normalized = normalizeTo20(json);
      setQuiz(normalized);
    } catch (e) {
      setError("Generation failed. Check your key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!quiz) return;
    onSave(quiz);
  };

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Generate quizzes (AI)</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <select value={apiProvider} onChange={(e) => setProvider(e.target.value)} className="rounded-lg bg-surface/60 p-2">
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
            <input
              type="password"
              placeholder="API Key (stored in session)"
              value={apiKey}
              onChange={(e) => setKey(e.target.value)}
              className="rounded-lg bg-surface/60 p-2"
            />
          </div>

          <input
            placeholder="YouTube link (optional)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="rounded-lg bg-surface/60 p-2"
          />
          <textarea
            rows={6}
            placeholder="Paste transcript or training text (recommended for MVP)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg bg-surface/60 p-2"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setLocalFiles(Array.from(e.target.files || []))}
            className="rounded-lg bg-surface/60 p-2"
          />
          <div className="flex justify-end">
            <button type="button" onClick={handleExtractFromFiles} className="rounded-lg px-3 py-2 shadow">
              Extract text from files
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Will generate 20 questions: 7 easy, 7 intermediate, 6 advanced.</p>
            <button type="button" onClick={handleGenerate} disabled={loading} className="rounded-lg px-4 py-2 shadow hover:shadow-md">
              {loading ? "Generating..." : "Generate now"}
            </button>
          </div>

          {quiz && (
            <div className="space-y-4">
              <QuizMiniPreview data={quiz} />
              <QuizEditor value={quiz} onChange={setQuiz} />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg px-3 py-2">Cancel</button>
            <button onClick={handleSave} disabled={!quiz} className="rounded-lg bg-primary/80 px-4 py-2 font-semibold">
              Use these quizzes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
