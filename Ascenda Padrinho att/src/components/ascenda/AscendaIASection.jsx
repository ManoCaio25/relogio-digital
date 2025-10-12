import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

const ACCENT_STYLES = {
  sky: {
    cardRing: "ring-sky-400/20",
    checkbox: "text-sky-300 focus-visible:ring-sky-300/40",
  },
  violet: {
    cardRing: "ring-violet-400/20",
    checkbox: "text-violet-300 focus-visible:ring-violet-300/40",
  },
  fuchsia: {
    cardRing: "ring-fuchsia-400/20",
    checkbox: "text-fuchsia-300 focus-visible:ring-fuchsia-300/40",
  },
};

const SUMMARY_DOT_COLORS = {
  sky: "bg-sky-300/80",
  violet: "bg-violet-300/80",
  fuchsia: "bg-fuchsia-300/80",
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
      className={cn(
        "quiz-card flex h-full min-h-[200px] w-full flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-5 shadow-sm backdrop-blur-sm ring-1 transition-all duration-200 hover:shadow-md",
        accent.cardRing,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-base font-semibold whitespace-normal break-words normal-case">{title}</p>
          <p className="text-sm text-white/70 whitespace-normal break-words normal-case">{desc}</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-white/70">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle?.()}
            className={`h-4 w-4 rounded border border-white/40 bg-transparent accent-current ${accent.checkbox}`}
            aria-label={`Incluir nível ${title}`}
          />
          <span>Incluir</span>
        </label>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="flex flex-col text-xs uppercase tracking-wide text-white/50">
          <span className="font-medium">Questões</span>
          <span className="text-[11px] text-white/40">Disponíveis para este nível</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange?.(Math.max(0, (value || 0) - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-base text-white transition-all duration-200 hover:bg-white/10"
            aria-label={`Diminuir questões ${title}`}
          >
            −
          </button>
          <div
            className="flex h-9 min-w-[2.5rem] items-center justify-center rounded-xl border border-white/10 bg-background/80 px-2 text-center text-sm font-semibold text-white"
            aria-live="polite"
          >
            {value ?? 0}
          </div>
          <button
            type="button"
            onClick={() => onChange?.((value || 0) + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-base text-white transition-all duration-200 hover:bg-white/10"
            aria-label={`Aumentar questões ${title}`}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export const LevelCard = DifficultyCard;

/** ---- main component ---- */
export default function AscendaIASection({ open = false, onClose, onComplete }) {
  const [topic, setTopic] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sel, setSel] = useState({ easy: true, intermediate: true, advanced: false });
  const [counts, setCounts] = useState({ easy: 4, intermediate: 4, advanced: 2 });
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const topicInputRef = useRef(null);
  const cancellationRef = useRef(false);

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
    cancellationRef.current = false;

    try {
      const result = await fakeAscendaIAByLevels(req);
      if (!cancellationRef.current) {
        onComplete?.(result);
        onClose?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
    totalRequested > 0 &&
    (topic.trim().length > 0 || youtubeUrl.trim().length > 0);

  const summaryItems = levels.map((level) => ({
    ...level,
    enabled: Boolean(sel[level.code]),
    total: sel[level.code] ? Number(counts[level.code] || 0) : 0,
  }));
  useEffect(() => {
    if (!open) {
      setTopic("");
      setYoutubeUrl("");
      setSel({ easy: true, intermediate: true, advanced: false });
      setCounts({ easy: 4, intermediate: 4, advanced: 2 });
      setLoading(false);
      cancellationRef.current = false;
      return;
    }

    cancellationRef.current = false;

  const content = (
    <>
      <div className="quiz-layout">
        <div className="quiz-main">
          {/* header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">AscendaIA – Gerar Quizzes</h3>
              <p className="text-sm text-white/70 whitespace-normal break-words normal-case">
                Gere quizzes a partir de um tópico ou link do YouTube. Escolha os níveis e quantidades desejadas.
              </p>
            </div>
            {quiz && (
              <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">
                Rascunho pronto
              </span>
            )}
          </div>

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      topicInputRef.current?.focus();
    }, 150);

          {/* level cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        <aside className="quiz-summary space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">Resumo do pedido</h4>
            <p className="text-xs text-white/60">
              Ajuste os níveis e quantidades antes de gerar o quiz com a AscendaIA.
            </p>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading || !canGenerate}
            className="w-full rounded-2xl bg-gradient-to-r from-primary/90 to-fuchsia-600/80 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Gerando…" : "Gerar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
