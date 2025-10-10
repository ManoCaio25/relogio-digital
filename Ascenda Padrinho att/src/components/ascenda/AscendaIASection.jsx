import React, { useState } from "react";
import { motion } from "framer-motion";

/** ---- mock IA: generate questions per level (front-only) ---- */
function fakeAscendaIAByLevels({ topic, youtubeUrl, counts }) {
  const build = (level, n) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${level}-${i + 1}`,
      level,
      prompt: `(${level.toUpperCase()}) Q${i + 1} about ${topic}${
        youtubeUrl ? ` (src: ${youtubeUrl})` : ""
      }?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: Math.floor(Math.random() * 4),
    }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        topic,
        source: youtubeUrl || null,
        createdBy: "AscendaIA 🤖",
        createdAt: new Date().toISOString(),
        easy: build("easy", counts.easy || 0),
        intermediate: build("intermediate", counts.intermediate || 0),
        advanced: build("advanced", counts.advanced || 0),
      });
    }, 1600);
  });
}

/** ---- small UI helpers ---- */
const palette = {
  sky: {
    ring: "ring-sky-400/30",
    focus: "focus:ring-sky-400/40",
    accent: "accent-sky-300",
  },
  violet: {
    ring: "ring-violet-400/30",
    focus: "focus:ring-violet-400/40",
    accent: "accent-violet-300",
  },
  fuchsia: {
    ring: "ring-fuchsia-400/30",
    focus: "focus:ring-fuchsia-400/40",
    accent: "accent-fuchsia-300",
  },
};

function LevelCard({
  color = "sky",
  title,
  desc,
  checked,
  onToggle,
  value,
  onChange,
}) {
  const { ring, focus, accent } = palette[color] || palette.sky;

  const clampValue = (raw) => {
    const next = Number.isNaN(raw) ? 0 : Math.min(20, Math.max(0, raw));
    onChange(next);
  };

  const decrement = () => clampValue((value || 0) - 1);
  const increment = () => clampValue((value || 0) + 1);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={`min-w-[260px] w-full rounded-2xl border border-border/60 bg-surface/80 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary/40 ring-1 ${ring}`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h4 className="text-base font-medium text-white whitespace-normal break-words normal-case" title={title}>
              {title}
            </h4>
            <p className="text-sm text-white/75 whitespace-normal break-words normal-case">{desc}</p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-white/75">
            <span className="sr-only">Habilitar {title}</span>
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggle}
              className={`h-5 w-5 rounded border border-white/40 bg-background/60 focus:outline-none focus:ring-2 ${focus} ${accent}`}
            />
            <span className="whitespace-nowrap">Habilitar</span>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-white/60">Quantidade</span>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label={`Diminuir ${title}`}
              onClick={decrement}
              disabled={!checked || (value || 0) <= 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-background/70 text-lg text-white transition hover:bg-background/90 disabled:opacity-40 disabled:hover:bg-background/70 active:scale-[0.98]"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={20}
              value={value}
              onChange={(e) => clampValue(Number(e.target.value))}
              disabled={!checked}
              className={`h-9 w-20 rounded-lg border border-white/15 bg-background/60 px-3 text-center text-base font-medium text-white tabular-nums outline-none transition focus:ring-2 ${focus} disabled:opacity-40`}
            />
            <button
              type="button"
              aria-label={`Aumentar ${title}`}
              onClick={increment}
              disabled={!checked || (value || 0) >= 20}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-background/70 text-lg text-white transition hover:bg-background/90 disabled:opacity-40 disabled:hover:bg-background/70 active:scale-[0.98]"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatChip({ label, count, color = "sky" }) {
  const border = `border-${color}-400/30`;
  const bg = `bg-${color}-400/10`;
  const txt = `text-${color}-300`;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${border} ${bg} px-3 py-1 text-xs ${txt}`}>
      {label} <b className="text-white">{count}</b>
    </span>
  );
}

function PreviewCol({ label, items, color = "sky" }) {
  const border = `border-${color}-400/30`;
  return (
    <div className={`rounded-xl border ${border} p-3`}>
      <div className="mb-2 text-sm font-semibold">{label}</div>
      <ul className="max-h-56 space-y-1 overflow-auto pr-1 text-sm text-white/70">
        {items.length === 0 && <li className="text-white/40">No items</li>}
        {items.slice(0, 8).map((q) => (
          <li key={q.id}>• {q.prompt}</li>
        ))}
      </ul>
    </div>
  );
}

/** ---- main component ---- */
export default function AscendaIASection() {
  const [topic, setTopic] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sel, setSel] = useState({ easy: true, intermediate: true, advanced: false });
  const [counts, setCounts] = useState({ easy: 4, intermediate: 4, advanced: 2 });
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const totalRequested =
    (sel.easy ? counts.easy : 0) +
    (sel.intermediate ? counts.intermediate : 0) +
    (sel.advanced ? counts.advanced : 0);

  const generate = async () => {
    const topicClean = topic.trim();
    const youtubeClean = youtubeUrl.trim();
    if (!topicClean && !youtubeClean) return;
    const req = {
      topic: topicClean || youtubeClean,
      youtubeUrl: youtubeClean || null,
      counts: {
        easy: sel.easy ? Number(counts.easy || 0) : 0,
        intermediate: sel.intermediate ? Number(counts.intermediate || 0) : 0,
        advanced: sel.advanced ? Number(counts.advanced || 0) : 0,
      },
    };
    if (!req.counts.easy && !req.counts.intermediate && !req.counts.advanced) return;

    setLoading(true);
    const result = await fakeAscendaIAByLevels(req);
    setQuiz(result);
    setLoading(false);
  };

  const canGenerate =
    !loading &&
    totalRequested > 0 &&
    (topic.trim().length > 0 || youtubeUrl.trim().length > 0);

  const save = () => {
    const key = "ascenda_quizzes";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({
      id: `quiz_${Date.now()}`,
      topic: quiz.topic,
      source: quiz.source,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
      items: [...quiz.easy, ...quiz.intermediate, ...quiz.advanced],
      breakdown: {
        easy: quiz.easy.length,
        intermediate: quiz.intermediate.length,
        advanced: quiz.advanced.length,
      },
      status: "draft",
    });
    localStorage.setItem(key, JSON.stringify(list));
    alert("✅ Quiz saved locally!");
  };

  const Level = ({ code, title, desc, color }) => (
    <LevelCard
      color={color}
      title={title}
      desc={desc}
      checked={sel[code]}
      onToggle={() => setSel((s) => ({ ...s, [code]: !s[code] }))}
      value={counts[code]}
      onChange={(n) => setCounts((c) => ({ ...c, [code]: n }))}
    />
  );

  return (
    <section className="space-y-5 rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">AscendaIA – Gerar Quizzes</h3>
          <p className="text-sm text-white/70 whitespace-normal break-words normal-case">
            Gere quizzes a partir de um tópico ou link do YouTube. Escolha os níveis e quantidades desejados.
          </p>
        </div>
        {quiz && (
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">
            Rascunho pronto
          </span>
        )}
      </div>

      {/* inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Tópico</span>
          <input
            className="h-10 rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-primary/40"
            placeholder="Tópico (ex.: React, Lógica, SQL)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Link do YouTube</span>
          <input
            className="h-10 rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-primary/40"
            placeholder="Link do YouTube (opcional)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </label>
      </div>

      {/* level cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Level code="easy" title="Básico" desc="Vitórias rápidas e aquecimento" color="sky" />
        <Level code="intermediate" title="Intermediário" desc="Raciocínio baseado em cenários" color="violet" />
        <Level code="advanced" title="Avançado" desc="Profundidade estratégica e arquitetural" color="fuchsia" />
      </div>

      {/* actions */}
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="inline-flex items-center gap-2 text-sm text-white/75" aria-live="polite">
          Total solicitado:
          <span className="rounded-full bg-white/10 px-3 py-1 text-white">{totalRequested}</span>
        </span>
        <button
          type="button"
          onClick={generate}
          disabled={!canGenerate}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-md transition md:w-auto ${
            canGenerate
              ? "bg-gradient-to-r from-primary/90 to-fuchsia-600/80 text-white hover:shadow-lg"
              : "bg-muted/60 text-white/60"
          }`}
        >
          {loading ? "Gerando…" : "Gerar com AscendaIA"}
        </button>
      </div>

      {/* loading */}
      {loading && (
        <motion.div
          className="mt-3 h-1 w-full rounded-full bg-white/10"
          initial={{ scaleX: 0.1, opacity: 0.6 }}
          animate={{ scaleX: [0.1, 1, 0.3, 1], opacity: [0.6, 1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ transformOrigin: "0% 50%" }}
        />
      )}

      {/* preview */}
      {quiz && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-white/70">
              <span className="font-semibold">{quiz.topic}</span>
              <span className="mx-2">•</span>
              Total of{" "}
              <span className="font-semibold">
                {quiz.easy.length + quiz.intermediate.length + quiz.advanced.length}
              </span>{" "}
              questions
            </div>
            <div className="flex gap-2">
              <StatChip label="Easy" count={quiz.easy.length} color="sky" />
              <StatChip label="Intermediate" count={quiz.intermediate.length} color="violet" />
              <StatChip label="Advanced" count={quiz.advanced.length} color="fuchsia" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <PreviewCol label="Easy" color="sky" items={quiz.easy} />
            <PreviewCol label="Intermediate" color="violet" items={quiz.intermediate} />
            <PreviewCol label="Advanced" color="fuchsia" items={quiz.advanced} />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuiz(null)}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-emerald-500/80 px-4 py-2 text-sm font-semibold shadow-md hover:brightness-110"
            >
              Save quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
