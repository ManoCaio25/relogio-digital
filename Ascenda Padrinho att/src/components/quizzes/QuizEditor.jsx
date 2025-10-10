// QuizEditor.jsx — inline editor to tweak questions/options/correct answer
// Lightweight and dependency-free (except tailwind classes)

import React from "react";

export default function QuizEditor({ value, onChange }) {
  const [state, setState] = React.useState(value);

  React.useEffect(() => setState(value), [value]);

  const update = (level, index, patch) => {
    const next = { ...state, [level]: [...(state[level] || [])] };
    next[level][index] = { ...next[level][index], ...patch };
    setState(next);
    onChange?.(next);
  };

  const LevelBlock = ({ level }) => (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="mb-2 font-semibold capitalize">{level}</div>
      <div className="space-y-4">
        {(state[level] || []).map((q, i) => (
          <div key={q.id} className="rounded-lg bg-surface/50 p-3 shadow-sm">
            <input
              className="mb-2 w-full rounded-md bg-surface/70 p-2"
              value={q.prompt}
              onChange={(e) => update(level, i, { prompt: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${q.id}-correct`}
                    checked={q.correctIndex === oi}
                    onChange={() => update(level, i, { correctIndex: oi })}
                  />
                  <input
                    className="w-full rounded-md bg-surface/70 p-2"
                    value={opt}
                    onChange={(e) => {
                      const options = [...q.options];
                      options[oi] = e.target.value;
                      update(level, i, { options });
                    }}
                  />
                </div>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Explanation (optional)"
              className="mt-2 w-full rounded-md bg-surface/70 p-2 text-sm"
              value={q.explanation || ""}
              onChange={(e) => update(level, i, { explanation: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <LevelBlock level="easy" />
      <LevelBlock level="intermediate" />
      <LevelBlock level="advanced" />
    </div>
  );
}
