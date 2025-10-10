import React, { useState } from "react";
import { motion } from "framer-motion";

// IA simulada (sem API key, sem backend)
function fakeAscendaIA({ topic, count }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        prompt: `Pergunta ${i + 1} sobre ${topic}?`,
        options: ["Opção A", "Opção B", "Opção C", "Opção D"],
        correctIndex: Math.floor(Math.random() * 4),
      }));
      resolve({
        topic,
        total: count,
        createdBy: "AscendaIA 🤖",
        createdAt: new Date().toLocaleString(),
        questions,
      });
    }, 1800);
  });
}

export default function AscendaIASection() {
  const [topic, setTopic] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const result = await fakeAscendaIA({ topic: topic.trim(), count: Number(count) || 10 });
    setQuiz(result);
    setLoading(false);
  };

  const handleSave = () => {
    const key = "ascenda_quizzes";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push(quiz);
    localStorage.setItem(key, JSON.stringify(list));
    alert("✅ Quiz salvo localmente com sucesso!");
  };

  return (
    <div className="rounded-2xl border border-border/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">🧠 AscendaIA — Gerador Inteligente de Quizzes</h3>
          <p className="text-sm text-muted-foreground">
            Crie quizzes a partir de vídeos, documentos ou apenas um tema. 100% front-end (sem API key).
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded-lg bg-surface/60 p-2"
          placeholder="Tema do treinamento (ex.: React Hooks)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          className="rounded-lg bg-surface/60 p-2"
          placeholder="Link do YouTube (opcional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="rounded-lg bg-surface/60 p-2"
          placeholder="Nº de questões"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="rounded-xl bg-primary/80 px-4 py-2 font-semibold shadow hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Gerando..." : "✨ Gerar com AscendaIA"}
      </button>

      {loading && (
        <motion.p
          className="text-sm text-center text-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          AscendaIA está analisando seu conteúdo... 🧠
        </motion.p>
      )}

      {quiz && (
        <div className="rounded-xl border border-border/60 p-3 mt-2">
          <h4 className="font-semibold">✅ Quiz gerado: {quiz.topic} ({quiz.total} questões)</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {quiz.questions.slice(0, 5).map((q) => <li key={q.id}>• {q.prompt}</li>)}
          </ul>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={handleSave} className="rounded-lg bg-green-600/80 px-3 py-1 text-sm">
              Salvar quiz
            </button>
            <button type="button" onClick={() => setQuiz(null)} className="rounded-lg px-3 py-1 text-sm border">
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

