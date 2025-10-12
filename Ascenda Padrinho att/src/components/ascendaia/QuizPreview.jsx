import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

const difficultyStyles = {
  easy: "bg-emerald-500/10 text-emerald-200",
  medium: "bg-amber-500/10 text-amber-200",
  hard: "bg-rose-500/10 text-rose-200",
};

const difficultyLabels = {
  easy: "Iniciante",
  medium: "Intermediário",
  hard: "Avançado",
};

export default function QuizPreview({ quiz }) {
  if (!quiz) {
    return null;
  }

  const { items = [], difficulty, topic } = quiz;
  const badgeClass = difficultyStyles[difficulty] || difficultyStyles.easy;
  const difficultyLabel = difficultyLabels[difficulty] || "Iniciante";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Pré-visualização do Quiz</h3>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              badgeClass,
            )}
          >
            {difficultyLabel}
          </span>
        </div>
        <p className="text-sm text-white/60">{topic}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.article
            key={item.id || index}
            layout
            className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-inner shadow-black/20"
          >
            <header className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                Questão {index + 1}
              </span>
              <span className="text-[11px] text-white/50">Resposta correta: {String.fromCharCode(65 + item.answerIndex)}</span>
            </header>

            <p className="mt-2 text-sm font-medium text-white/90">{item.question}</p>

            <ul className="mt-3 space-y-2">
              {item.options.map((option, optionIndex) => (
                <li
                  key={`${item.id}-opt-${optionIndex}`}
                  className={cn(
                    "rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/80",
                    optionIndex === item.answerIndex &&
                      "border-emerald-400/60 bg-emerald-500/10 text-emerald-100",
                  )}
                >
                  {option}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-white/60">Nenhuma questão gerada ainda.</p>
        )}
      </div>
    </div>
  );
}
