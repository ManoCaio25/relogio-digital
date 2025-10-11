import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const ACCENT_STYLES = {
  sky: {
    cardRing: "ring-sky-400/20",
    checkbox: "text-sky-300 focus-visible:ring-sky-300/40",
    chipBorder: "border-sky-400/40",
    chipBg: "bg-sky-400/10",
    chipText: "text-sky-100",
    previewBorder: "border-sky-400/40",
    inputFocus: "focus:border-sky-300/60 focus:ring-sky-300/30",
  },
  violet: {
    cardRing: "ring-violet-400/20",
    checkbox: "text-violet-300 focus-visible:ring-violet-300/40",
    chipBorder: "border-violet-400/40",
    chipBg: "bg-violet-400/10",
    chipText: "text-violet-100",
    previewBorder: "border-violet-400/40",
    inputFocus: "focus:border-violet-300/60 focus:ring-violet-300/30",
  },
  fuchsia: {
    cardRing: "ring-fuchsia-400/20",
    checkbox: "text-fuchsia-300 focus-visible:ring-fuchsia-300/40",
    chipBorder: "border-fuchsia-400/40",
    chipBg: "bg-fuchsia-400/10",
    chipText: "text-fuchsia-100",
    previewBorder: "border-fuchsia-400/40",
    inputFocus: "focus:border-fuchsia-300/60 focus:ring-fuchsia-300/30",
  },
};

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
function DifficultyCard({ title, desc, checked, onToggle, value, onChange, color = "sky" }) {
  const accent = ACCENT_STYLES[color] ?? ACCENT_STYLES.sky;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex h-full min-w-[260px] w-full flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-5 shadow-sm backdrop-blur-sm ring-1 ${accent.cardRing} transition-all duration-200 hover:shadow-md`}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-medium whitespace-normal break-words normal-case">{title}</p>
          <p className="text-sm opacity-80 whitespace-normal break-words normal-case">{desc}</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-white/70">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle?.()}
            className={`h-4 w-4 rounded border border-white/40 bg-transparent accent-current ${accent.checkbox}`}
            aria-label={`Incluir nível ${title}`}
          />
          <span className="whitespace-nowrap">Incluir</span>
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-white/50">Questões</span>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onChange?.(Math.max(0, (value || 0) - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-background/60 text-lg text-white transition-all duration-200 hover:bg-white/10"
            aria-label={`Remover questão de nível ${title}`}
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={value ?? 0}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className={`h-10 w-20 rounded-xl border border-white/10 bg-background/80 px-3 text-center text-sm text-white outline-none transition focus:ring-2 ${accent.inputFocus}`}
            aria-label={`Quantidade de questões nível ${title}`}
          />
          <button
            type="button"
            onClick={() => onChange?.((value || 0) + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-background/60 text-lg text-white transition-all duration-200 hover:bg-white/10"
            aria-label={`Adicionar questão de nível ${title}`}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CardsContainer({ children }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:[grid-template-columns:repeat(3,minmax(260px,1fr))] items-stretch isolate">
      {children}
    </div>
  );
}

export const LevelCard = DifficultyCard;

function StatChip({ label, count, color = "sky" }) {
  const accent = ACCENT_STYLES[color] ?? ACCENT_STYLES.sky;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${accent.chipBorder} ${accent.chipBg} ${accent.chipText}`}
    >
      {label} <b className="text-white">{count}</b>
    </span>
  );
}

function PreviewCol({ label, items, color = "sky" }) {
  const accent = ACCENT_STYLES[color] ?? ACCENT_STYLES.sky;
  return (
    <div className={`rounded-xl border p-3 ${accent.previewBorder}`}>
      <div className="mb-2 text-sm font-semibold">{label}</div>
      <ul className="max-h-56 space-y-1 overflow-auto pr-1 text-sm text-white/70">
        {items.length === 0 && <li className="text-white/40">Sem itens</li>}
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

  const levels = useMemo(
    () => [
      {
        code: "easy",
        title: "Básico",
        desc: "Vitórias rápidas e aquecimento",
        accent: "sky",
      },
      {
        code: "intermediate",
        title: "Intermediário",
        desc: "Raciocínio baseado em cenários",
        accent: "violet",
      },
      {
        code: "advanced",
        title: "Avançado",
        desc: "Profundidade estratégica e arquitetural",
        accent: "fuchsia",
      },
    ],
    []
  );

  const totalRequested =
    (sel.easy ? counts.easy : 0) +
    (sel.intermediate ? counts.intermediate : 0) +
    (sel.advanced ? counts.advanced : 0);

  const handleToggleLevel = (code) => {
    setSel((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleCountChange = (code, value) => {
    const numeric = Number(value);
    const safe = Number.isFinite(numeric) ? numeric : 0;
    setCounts((prev) => ({
      ...prev,
      [code]: Math.max(0, safe),
    }));
  };

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
    setQuiz(null);
    try {
      const result = await fakeAscendaIAByLevels(req);
      setQuiz(result);
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
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

  return (
    <section className="space-y-6 rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-lg backdrop-blur">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">AscendaIA – Gerar Quizzes</h3>
          <p className="text-sm text-white/70 whitespace-normal break-words normal-case">
            Gere quizzes a partir de um tópico ou link do YouTube. Escolha os níveis e quantidades desejadas.
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
          <span className="text-sm font-medium text-white">Tópico</span>
          <input
            className="h-10 w-full rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-primary/40"
            placeholder="Tópico (ex.: React, Lógica, SQL)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Tópico do quiz"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="text-sm font-medium text-white">Link do YouTube</span>
          <input
            className="h-10 w-full rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-primary/40"
            placeholder="Link do YouTube (opcional)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            aria-label="Link do YouTube para referência"
          />
        </label>
      </div>

      {/* level cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {levels.map((level) => (
          <LevelCard
            key={level.code}
            color={level.accent}
            title={level.title}
            desc={level.desc}
            checked={Boolean(sel[level.code])}
            onToggle={() => handleToggleLevel(level.code)}
            value={counts[level.code]}
            onChange={(next) => handleCountChange(level.code, next)}
          />
        ))}
      </div>

      {/* actions */}
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-white/80" aria-live="polite">
          Total solicitado: <span className="font-semibold text-white">{totalRequested}</span>
        </p>
        <button
          type="button"
          onClick={generate}
          disabled={loading || !canGenerate}
          className="w-full rounded-2xl bg-gradient-to-r from-primary/90 to-fuchsia-600/80 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:opacity-60 md:w-auto"
        >
          {loading ? "Gerando…" : "✨ Gerar com AscendaIA"}
        </button>
      </div>

      {/* loading */}
      {loading && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-loading-stripes rounded-full bg-gradient-to-r from-violet-400/60 via-violet-300/80 to-fuchsia-400/60" />
        </div>
      )}

      {/* preview */}
      {quiz && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-white/70">
              <span className="font-semibold">{quiz.topic}</span>
              <span className="mx-2 hidden md:inline">•</span>
              <span className="block md:inline">
                Total de <span className="font-semibold">{quiz.easy.length + quiz.intermediate.length + quiz.advanced.length}</span> questões
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatChip label="Básico" count={quiz.easy.length} color="sky" />
              <StatChip label="Intermediário" count={quiz.intermediate.length} color="violet" />
              <StatChip label="Avançado" count={quiz.advanced.length} color="fuchsia" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <PreviewCol label="Básico" color="sky" items={quiz.easy} />
            <PreviewCol label="Intermediário" color="violet" items={quiz.intermediate} />
            <PreviewCol label="Avançado" color="fuchsia" items={quiz.advanced} />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuiz(null)}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm transition-all duration-200 hover:bg-white/5"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-md transition-all duration-200 hover:brightness-110"
            >
              Salvar quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
