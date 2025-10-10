// normalizeQuiz.js — enforce 20 questions and a clean structure
// 7 easy, 7 intermediate, 6 advanced

import { nanoid } from "nanoid";

export function normalizeTo20(data) {
  const want = { easy: 7, intermediate: 7, advanced: 6 };
  const out = { easy: [], intermediate: [], advanced: [] };

  ["easy", "intermediate", "advanced"].forEach((level) => {
    const arr = Array.isArray(data?.[level]) ? data[level] : [];
    const seen = new Set();
    for (const q of arr) {
      const ok =
        q?.prompt &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.correctIndex) &&
        q.correctIndex >= 0 &&
        q.correctIndex < 4;
      const sig = ok ? q.prompt + "||" + q.options.join("|") : "";
      if (ok && !seen.has(sig)) {
        seen.add(sig);
        out[level].push({
          id: nanoid(8),
          level,
          prompt: String(q.prompt).trim(),
          options: q.options.map((x) => String(x).trim()),
          correctIndex: q.correctIndex,
          explanation: q.explanation ? String(q.explanation).trim() : "",
        });
      }
    }
  });

  const pool = [...out.easy, ...out.intermediate, ...out.advanced];
  for (const level of ["easy", "intermediate", "advanced"]) {
    while (out[level].length < want[level] && pool.length) {
      const cand = pool.find((q) => !out[level].includes(q));
      if (!cand) break;
      out[level].push(cand);
    }
    out[level] = out[level].slice(0, want[level]);
  }

  return out;
}
