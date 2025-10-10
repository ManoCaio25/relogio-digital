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

function NivelCard({ cor = "sky", titulo, desc, habilitado, onToggle, valor, onChange }) {
  const ring = `ring-${cor}-400/40`;
  const border = `border-${cor}-400/20`;
  return (
    <div className={`flex h-full flex-col justify-between rounded-2xl border ${border} bg-white/5 p-3 ring-1 ${ring}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-semibold">{titulo}</div>
          <div className="text-xs text-white/60">{desc}</div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-white/70">
          <input type="checkbox" checked={habilitado} onChange={onToggle} />
          <span>Ativar</span>
        </label>
      </div>

      <div className="mt-2">
        <div className="text-[11px] uppercase tracking-wide text-white/50">Questões</div>
        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, (valor || 0) - 1))}
            className="h-8 w-8 rounded-lg border border-white/15 text-lg leading-none hover:bg-white/5"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={valor}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-center outline-none ring-1 ring-white/10"
          />
          <button
            type="button"
            onClick={() => onChange((valor || 0) + 1)}
            className="h-8 w-8 rounded-lg border border-white/15 text-lg leading-none hover:bg-white/5"
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
  const bg = `bg-${cor}-400/10`;
  const txt = `text-${cor}-300`;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${border} ${bg} px-3 py-1 text-xs ${txt}`}>
      {rotulo} <b className="text-white">{qtd}</b>
    </span>
  );
}

function ColunaPreview({ rotulo, itens, cor = "sky" }) {
  const border = `border-${cor}-400/30`;
  return (
    <div className={`rounded-xl border ${border} p-3`}>
      <div className="mb-2 text-sm font-semibold">{rotulo}</div>
      <ul className="max-h-56 space-y-1 overflow-auto pr-1 text-sm text-white/70">
        {itens.length === 0 && <li className="text-white/40">Sem itens</li>}
        {itens.slice(0, 8).map((q) => (
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
    if (!topic.trim()) return;
    const req = {
      topic: topic.trim(),
      youtubeUrl: youtubeUrl.trim() || null,
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
    alert("✅ Atividades salvas localmente!");
  };

  const Nivel = ({ code, titulo, desc, cor }) => (
    <NivelCard
      cor={cor}
      titulo={titulo}
      desc={desc}
      habilitado={sel[code]}
      onToggle={() => setSel((s) => ({ ...s, [code]: !s[code] }))}
      valor={counts[code]}
      onChange={(n) => setCounts((c) => ({ ...c, [code]: n }))}
    />
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">🧠 Gerar atividades</h3>
          <p className="text-sm text-white/60">
            Crie atividades a partir de um tema ou link do YouTube. Selecione os níveis de dificuldade e quantidades.
          </p>
        </div>
        {quiz && (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Rascunho pronto
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          className="rounded-xl bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-primary/50"
          placeholder="Tema (ex.: React Hooks)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          className="rounded-xl bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-primary/50"
          placeholder="Link do YouTube (opcional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Nivel code="easy" titulo="Fácil" desc="Revisões e aquecimentos" cor="sky" />
        <Nivel code="intermediate" titulo="Intermediário" desc="Raciocínio baseado em cenários" cor="violet" />
        <Nivel code="advanced" titulo="Avançado" desc="Profundidade estratégica e arquitetural" cor="fuchsia" />
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="text-xs text-white/60">
          Total solicitado: <span className="rounded-md bg-white/10 px-2 py-0.5 text-white">{totalRequested}</span>
        </span>
        <button
          type="button"
          onClick={generate}
          disabled={loading || !topic.trim() || totalRequested === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 px-4 py-2 font-medium shadow-lg shadow-fuchsia-500/10 transition hover:brightness-110 disabled:opacity-50 md:w-auto"
        >
          {loading ? "Gerando atividades…" : "✨ Gerar atividades"}
        </button>
      </div>

      {loading && (
        <motion.div
          className="mt-3 h-1 w-full rounded-full bg-white/10"
          initial={{ scaleX: 0.1, opacity: 0.6 }}
          animate={{ scaleX: [0.1, 1, 0.3, 1], opacity: [0.6, 1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ transformOrigin: "0% 50%" }}
        />
      )}

      {quiz && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-white/70">
              <span className="font-semibold">{quiz.topic}</span>
              <span className="mx-2">•</span>
              Total de <span className="font-semibold">{quiz.easy.length + quiz.intermediate.length + quiz.advanced.length}</span> questões
            </div>
            <div className="flex flex-wrap gap-2">
              <ChipContagem rotulo="Fácil" qtd={quiz.easy.length} cor="sky" />
              <ChipContagem rotulo="Intermediário" qtd={quiz.intermediate.length} cor="violet" />
              <ChipContagem rotulo="Avançado" qtd={quiz.advanced.length} cor="fuchsia" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ColunaPreview rotulo="Fácil" cor="sky" itens={quiz.easy} />
            <ColunaPreview rotulo="Intermediário" cor="violet" itens={quiz.intermediate} />
            <ColunaPreview rotulo="Avançado" cor="fuchsia" itens={quiz.advanced} />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuiz(null)}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-emerald-500/80 px-4 py-2 text-sm font-semibold shadow-md hover:brightness-110"
            >
              Salvar atividades
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
