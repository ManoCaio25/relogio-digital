import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

const ACCENT_STYLES = {
  sky: {
    cardRing: "ring-sky-400/20",
    checkbox: "text-sky-300 focus-visible:ring-sky-300/40",
    chipBorder: "border-sky-400/40",
    chipBg: "bg-sky-400/10",
    chipText: "text-sky-100",
    previewBorder: "border-sky-400/40",
  },
  violet: {
    cardRing: "ring-violet-400/20",
    checkbox: "text-violet-300 focus-visible:ring-violet-300/40",
    chipBorder: "border-violet-400/40",
    chipBg: "bg-violet-400/10",
    chipText: "text-violet-100",
    previewBorder: "border-violet-400/40",
  },
  fuchsia: {
    cardRing: "ring-fuchsia-400/20",
    checkbox: "text-fuchsia-300 focus-visible:ring-fuchsia-300/40",
    chipBorder: "border-fuchsia-400/40",
    chipBg: "bg-fuchsia-400/10",
    chipText: "text-fuchsia-100",
    previewBorder: "border-fuchsia-400/40",
  },
};

const SUMMARY_DOT_COLORS = {
  sky: "bg-sky-300/80",
  violet: "bg-violet-300/80",
  fuchsia: "bg-fuchsia-300/80",
};

const INITIAL_LEVEL_SELECTION = { easy: true, intermediate: true, advanced: false };
const INITIAL_COUNTS = { easy: 4, intermediate: 4, advanced: 2 };

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
function CountField({
  title,
  desc,
  accent = "sky",
  value,
  disabled,
  onDecrease,
  onIncrease,
  onValueChange,
}) {
  const accentStyles = ACCENT_STYLES[accent] ?? ACCENT_STYLES.sky;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-surface/70 p-4 transition",
        disabled && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-white/60">{desc}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
            disabled ? "bg-white/5 text-white/40" : `${accentStyles.chipBg} ${accentStyles.chipText} ${accentStyles.chipBorder}`,
          )}
        >
          {disabled ? "Off" : "On"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-base text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Diminuir questões ${title}`}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={value ?? 0}
          onChange={(event) => onValueChange?.(event.target.value)}
          onBlur={(event) => onValueChange?.(event.target.value)}
          disabled={disabled}
          className="h-9 w-full rounded-xl border border-border/50 bg-background/80 px-3 text-center text-sm font-semibold text-white outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed"
          aria-label={`Quantidade de questões para ${title}`}
        />
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-base text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Aumentar questões ${title}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

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
      <ul className="quiz-preview-list max-h-56 space-y-1 overflow-auto pr-1 text-sm text-white/70">
        {items.length === 0 && <li className="text-white/40">Sem itens</li>}
        {items.slice(0, 8).map((q) => (
          <li key={q.id}>• {q.prompt}</li>
        ))}
      </ul>
    </div>
  );
}

/** ---- main component ---- */
export default function AscendaIASection({ asModal = false, variant = "standalone" }) {
  const [topicEntry, setTopicEntry] = useState("");
  const [sel, setSel] = useState(() => ({ ...INITIAL_LEVEL_SELECTION }));
  const [counts, setCounts] = useState(() => ({ ...INITIAL_COUNTS }));
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const levels = useMemo(
    () => [
      {
        code: "easy",
        title: "Iniciante",
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
    const raw = topicEntry.trim();
    const looksLikeUrl = /^https?:\/\//i.test(raw);
    const topicClean = looksLikeUrl ? "" : raw;
    const youtubeClean = looksLikeUrl ? raw : "";
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
    topicEntry.trim().length > 0;

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

  const summaryItems = levels.map((level) => ({
    ...level,
    enabled: Boolean(sel[level.code]),
    total: sel[level.code] ? Number(counts[level.code] || 0) : 0,
  }));

  const isEmbedded = variant === "embedded";

  const wrapperProps = {
    role: "region",
    "aria-label": "Gerar Quizzes",
    "data-quiz-scope": "",
    className: cn(
      "w-full rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm sm:p-7",
      asModal ? "max-w-full" : "",
    ),
    style: { height: "auto", minHeight: 0, overflow: "visible" },
  };

  const content = (
    <>
      <div className="quiz-layout grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <aside className="quiz-sidebar flex w-full flex-col gap-5 rounded-2xl border border-border/60 bg-surface/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">AscendAI - Gerar Quizzes</h2>
            <p className="text-sm text-white/70 whitespace-normal break-words normal-case">
              Gere quizzes a partir de um tópico ou link do YouTube. Escolha os níveis e quantidades desejadas.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm text-white/70">
            <span className="text-sm font-medium text-white">Tópico ou link do YouTube</span>
            <input
              className="h-11 w-full rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-primary/40"
              placeholder="Informe um tema ou cole o link do vídeo"
              value={topicEntry}
              onChange={(e) => setTopicEntry(e.target.value)}
              aria-label="Tópico ou link do YouTube"
            />
          </label>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Resumo do pedido</h3>
              <p className="text-xs text-white/60">
                Ajuste os níveis e quantidades antes de gerar com a AscendalA.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-xs uppercase tracking-[0.08em] text-white/50">Total solicitado</span>
              <p className="mt-2 text-2xl font-semibold text-white">{totalRequested}</p>
              <p className="text-xs text-white/50">Quantidade total de questões planejadas.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-white">Distribuição por nível</h3>
            <ul className="space-y-2">
              {summaryItems.map((item) => (
                <li
                  key={item.code}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border border-white/5 bg-white/0 px-4 py-3 text-sm transition",
                    item.enabled ? "text-white" : "text-white/40",
                  )}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        SUMMARY_DOT_COLORS[item.accent] ?? "bg-white/40",
                      )}
                    />
                    {item.title}
                  </span>
                  <span className="text-xs uppercase tracking-[0.08em] text-white/60">
                    {item.enabled ? `${item.total} questões` : "Desativado"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {quiz && (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
              <p className="text-sm font-medium text-emerald-200">Quiz pronto! Revise abaixo antes de salvar.</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-surface/80 shadow-e1">
        <div className="border-b border-border/50 p-6">
          <h2 className="text-lg font-semibold text-white">Adicionar curso</h2>
          <p className="text-sm text-white/60">Configure o tema, níveis e gere o quiz automaticamente.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-medium text-white">Tópico ou link do YouTube</label>
              <input
                className="h-11 w-full rounded-xl border border-border/60 bg-background/80 px-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
                placeholder="Informe um tema ou cole o link do vídeo"
                value={topicEntry}
                onChange={(e) => setTopicEntry(e.target.value)}
                aria-label="Tópico ou link do YouTube"
              />
              <p className="text-xs text-white/50">Use um tema descritivo ou um vídeo que sirva como base para o conteúdo.</p>
            </div>

            <div className="lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-white">Dificuldade</label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((level) => {
                  const isActive = Boolean(sel[level.code]);
                  const accent = ACCENT_STYLES[level.accent] ?? ACCENT_STYLES.sky;
                  return (
                    <button
                      key={level.code}
                      type="button"
                      onClick={() => handleToggleLevel(level.code)}
                      className={cn(
                        "rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-border/40 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        isActive && cn(accent.chipBorder, accent.chipBg, accent.chipText),
                      )}
                      data-active={isActive}
                    >
                      {level.title}
                    </button>
                  );
                })}
              </div>
            ) : quiz ? (
              <p className="text-xs font-medium text-emerald-200">
                Quiz pronto! Revise o conteúdo abaixo ou salve como rascunho.
              </p>
            ) : (
              <p className="text-xs text-white/60">
                Informe um tópico ou link do YouTube e mantenha ao menos um nível selecionado para habilitar a geração.
              </p>
            )}
          </div>
        </aside>

        <div className="quiz-main flex flex-col gap-5">
          {quiz && (
            <span className="inline-flex w-full items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200 lg:justify-start">
              Rascunho pronto
            </span>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Níveis do curso</h3>
            <p className="text-sm text-white/70 whitespace-normal break-words normal-case">
              Ajuste a seleção de níveis e defina quantas questões deseja gerar para cada etapa do aprendizado.
            </p>
          </div>

          {/* level cards */}
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-5">
            {levels.map((level) => (
              <div key={level.code} className="quiz-card w-full md:min-w-[280px]">
                <LevelCard
                  color={level.accent}
                  title={level.title}
                  desc={level.desc}
                  checked={Boolean(sel[level.code])}
                  onToggle={() => handleToggleLevel(level.code)}
                  value={counts[level.code]}
                  onChange={(next) => handleCountChange(level.code, next)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-2xl border border-dashed border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            Adicionar novo curso
          </button>
        </div>
      </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <PreviewCol label="Básico" color="sky" items={quiz.easy} />
                <PreviewCol label="Intermediário" color="violet" items={quiz.intermediate} />
                <PreviewCol label="Avançado" color="fuchsia" items={quiz.advanced} />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border/50 p-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-white/60">
              {quiz ? "Revise e salve quando estiver pronto." : "Defina tema e níveis para liberar a geração."}
            </span>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setQuiz(null);
                  setTopicEntry("");
                  setSel({ ...INITIAL_LEVEL_SELECTION });
                  setCounts({ ...INITIAL_COUNTS });
                }}
                className="shrink-0 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!quiz}
                className="shrink-0 rounded-xl bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Salvar Quiz
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={loading || !canGenerate}
                className="shrink-0 rounded-xl bg-gradient-to-r from-primary/90 to-fuchsia-600/80 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Gerando…" : "Gerar Quiz com IA"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="status" aria-live="polite">
              <div className="h-full w-1/2 animate-loading-stripes rounded-full bg-gradient-to-r from-violet-400/60 via-violet-300/80 to-fuchsia-400/60" />
            </div>
          )}
          {!loading && !quiz && (
            <p className="mt-4 text-xs text-white/50">
              Informe um tópico ou link do YouTube e mantenha ao menos um nível selecionado para habilitar a geração.
            </p>
          )}
          {!loading && quiz && (
            <p className="mt-4 text-xs font-medium text-emerald-200">
              Quiz pronto! Você pode salvar o rascunho ou gerar novamente se quiser ajustar.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (asModal) {
    return <motion.div {...wrapperProps}>{content}</motion.div>;
  }

  return <section {...wrapperProps}>{content}</section>;
}
