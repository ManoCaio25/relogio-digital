import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

/** ---- mock IA: generate questions per level (front-only) ---- */
function fakeAscendaIAByLevels({ topic, youtubeUrl, counts }) {
  const build = (level, n) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${level}-${i + 1}`,
      level,
      prompt: `(${level.toUpperCase()}) Pergunta ${i + 1} sobre ${topic}${
        youtubeUrl ? ` (fonte: ${youtubeUrl})` : ""
      }?`,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
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

function NivelCard({
  cor = "sky",
  titulo,
  desc,
  habilitado,
  valor,
  onToggle,
  onChange,
}) {
  const ring = `ring-${cor}-400/40`;
  const border = `border-${cor}-400/20`;
  const decrease = () => onChange(Math.max(0, valor - 1));
  const increase = () => onChange(Math.min(20, valor + 1));

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-2xl border border-border/60 ${border} bg-surface/80 p-4 shadow-sm ring-1 ${ring} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <p className="text-sm font-semibold text-primary">{titulo}</p>
          <p className="text-xs text-secondary break-words">{desc}</p>
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-muted flex-shrink-0">
          <input type="checkbox" checked={habilitado} onChange={onToggle} />
          <span>Habilitar</span>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Questões</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrease}
            disabled={!habilitado || valor <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-surface/80 text-lg leading-none text-primary transition hover:bg-surface2/80 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Diminuir questões de ${titulo}`}
          >
            −
          </button>
          <input
            type="number"
            min={0}
            max={20}
            value={habilitado ? valor : 0}
            onChange={(e) => onChange(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
            disabled={!habilitado}
            className="h-9 w-16 rounded-lg border border-border/60 bg-surface/80 px-2 text-center text-sm text-primary outline-none ring-1 ring-ring/40 transition focus:ring-brand disabled:opacity-60"
            aria-label={`Quantidade de questões ${titulo}`}
          />
          <button
            type="button"
            onClick={increase}
            disabled={!habilitado || valor >= 20}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-surface/80 text-lg leading-none text-primary transition hover:bg-surface2/80 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Aumentar questões de ${titulo}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function ChipContagem({ rotulo, qtd, cor = "sky" }) {
  const border = `border-${cor}-400/30`;
  const bg = `bg-${cor}-400/15`;
  const txt = `text-${cor}-200`;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${border} ${bg} px-3 py-1 text-xs ${txt}`}>
      {rotulo} <b className="text-white">{qtd}</b>
    </span>
  );
}

function ColunaPreview({ rotulo, itens, cor = "sky" }) {
  const border = `border-${cor}-400/30`;
  return (
    <div className={`rounded-xl border ${border} bg-surface/60 p-4`}> 
      <div className="mb-2 text-sm font-semibold text-primary">{rotulo}</div>
      <ul className="max-h-56 space-y-1 overflow-auto pr-1 text-sm text-secondary">
        {itens.length === 0 && <li className="text-muted">Sem itens</li>}
        {itens.slice(0, 8).map((q) => (
          <li key={q.id}>• {q.prompt}</li>
        ))}
      </ul>
    </div>
  );
}

const difficultyConfig = {
  basic: {
    title: "Básico",
    description: "Vitórias rápidas e aquecimento",
    color: "sky",
    storageKey: "easy",
  },
  intermediate: {
    title: "Intermediário",
    description: "Raciocínio baseado em cenários",
    color: "violet",
    storageKey: "intermediate",
  },
  advanced: {
    title: "Avançado",
    description: "Profundidade estratégica e arquitetural",
    color: "fuchsia",
    storageKey: "advanced",
  },
};

/** ---- main component ---- */
export default function AscendaIASection() {
  const [topic, setTopic] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [levels, setLevels] = useState({
    basic: { enabled: true, count: 4 },
    intermediate: { enabled: true, count: 4 },
    advanced: { enabled: false, count: 2 },
  });
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const totalRequested = useMemo(
    () =>
      Object.values(levels)
        .filter((level) => level.enabled)
        .reduce((acc, level) => acc + level.count, 0),
    [levels]
  );

  const trimmedTopic = topic.trim();
  const trimmedYoutube = youtubeUrl.trim();
  const canGenerate = totalRequested > 0 && (trimmedTopic || trimmedYoutube);

  const toggleLevel = (key) => {
    setLevels((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateLevelCount = (key, value) => {
    setLevels((prev) => ({
      ...prev,
      [key]: { ...prev[key], count: value },
    }));
  };

  const generate = async () => {
    if (!canGenerate || loading) return;
    const referenceTopic = trimmedTopic || trimmedYoutube;
    const req = {
      topic: referenceTopic,
      youtubeUrl: trimmedYoutube || null,
      counts: {
        easy: levels.basic.enabled ? Number(levels.basic.count || 0) : 0,
        intermediate: levels.intermediate.enabled ? Number(levels.intermediate.count || 0) : 0,
        advanced: levels.advanced.enabled ? Number(levels.advanced.count || 0) : 0,
      },
    };

    if (!req.counts.easy && !req.counts.intermediate && !req.counts.advanced) {
      return;
    }

    setLoading(true);
    const result = await fakeAscendaIAByLevels(req);
    setQuiz(result);
    setLoading(false);
  };

  const save = () => {
    if (!quiz) return;
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
    alert("✅ Quizzes salvos localmente!");
  };

  return (
    <section className="space-y-6 rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-sm backdrop-blur">
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-primary">AscendaIA – Gerar Quizzes</h3>
          <p className="text-sm text-secondary">
            Crie quizzes a partir de um tema ou link do YouTube. Selecione os níveis de dificuldade e quantidades.
          </p>
        </div>
        {quiz && (
          <span className="inline-flex h-fit items-center rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs text-success">
            Rascunho pronto
          </span>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="h-10 w-full rounded-xl border border-border/60 bg-surface/80 px-3 text-sm text-primary outline-none ring-1 ring-ring/30 transition focus:ring-brand"
          placeholder="Tópico (ex.: React, Lógica, SQL)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="Tópico"
        />
        <input
          className="h-10 w-full rounded-xl border border-border/60 bg-surface/80 px-3 text-sm text-primary outline-none ring-1 ring-ring/30 transition focus:ring-brand"
          placeholder="Link do YouTube (opcional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          aria-label="Link do YouTube (opcional)"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.entries(difficultyConfig).map(([key, config]) => (
          <NivelCard
            key={key}
            cor={config.color}
            titulo={config.title}
            desc={config.description}
            habilitado={levels[key].enabled}
            valor={levels[key].count}
            onToggle={() => toggleLevel(key)}
            onChange={(value) => updateLevelCount(key, value)}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-secondary" aria-live="polite">
          Total solicitado: <span className="font-semibold text-primary">{totalRequested}</span>
        </p>
        <div className="flex w-full flex-col gap-2 md:w-auto">
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-bg shadow-e1 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {loading ? "Gerando..." : "Gerar com AscendaIA"}
          </button>
          {totalRequested === 0 && (
            <span className="text-xs text-warning">Selecione ao menos 1 questão.</span>
          )}
        </div>
      </div>

      {loading && (
        <motion.div
          className="h-1 w-full rounded-full bg-surface2/60"
          initial={{ scaleX: 0.1, opacity: 0.6 }}
          animate={{ scaleX: [0.1, 1, 0.3, 1], opacity: [0.6, 1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ transformOrigin: "0% 50%" }}
        />
      )}

      {quiz && (
        <div className="space-y-4 rounded-3xl border border-border/60 bg-surface2/80 p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-secondary">
              <span className="font-semibold text-primary">{quiz.topic}</span>
              <span className="mx-2 text-muted">•</span>
              Total de
              <span className="ml-1 font-semibold text-primary">
                {quiz.easy.length + quiz.intermediate.length + quiz.advanced.length}
              </span>{" "}
              questões
            </p>
            <div className="flex flex-wrap gap-2">
              <ChipContagem rotulo="Básico" qtd={quiz.easy.length} cor="sky" />
              <ChipContagem rotulo="Intermediário" qtd={quiz.intermediate.length} cor="violet" />
              <ChipContagem rotulo="Avançado" qtd={quiz.advanced.length} cor="fuchsia" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ColunaPreview rotulo="Básico" cor="sky" itens={quiz.easy} />
            <ColunaPreview rotulo="Intermediário" cor="violet" itens={quiz.intermediate} />
            <ColunaPreview rotulo="Avançado" cor="fuchsia" itens={quiz.advanced} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setQuiz(null)}
              className="inline-flex items-center justify-center rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-secondary transition hover:bg-surface/80"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center justify-center rounded-xl bg-success/80 px-4 py-2 text-sm font-semibold text-bg shadow-e1 transition hover:brightness-110"
            >
              Salvar quizzes
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
