import React from "react";
import { motion } from "framer-motion";
import { fakeAscendaIA } from "../../utils/fakeAscendaIA";

const STORAGE_KEY = "ascenda_quizzes";

const createId = () =>
  (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `quiz_${Date.now()}`);

function readStoredQuizzes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("AscendaIA: failed to read stored quizzes", error);
    return [];
  }
}

function writeStoredQuizzes(quizzes) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch (error) {
    console.warn("AscendaIA: failed to persist quizzes", error);
  }
}

const generateButtonClass = [
  "rounded-xl",
  "bg-gradient-to-r",
  "from-purple-500",
  "via-fuchsia-500",
  "to-indigo-500",
  "px-4",
  "py-2",
  "font-semibold",
  "text-white",
  "shadow",
  "hover:from-purple-400",
  "hover:via-fuchsia-400",
  "hover:to-indigo-400",
  "disabled:cursor-not-allowed",
  "disabled:opacity-60",
].join(" ");

export default function AscendaIASection({ attachedQuiz, onAttach }) {
  const [topic, setTopic] = React.useState("");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [count, setCount] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [quiz, setQuiz] = React.useState(null);
  const [savedQuizzes, setSavedQuizzes] = React.useState(() => readStoredQuizzes());
  const [activeId, setActiveId] = React.useState(attachedQuiz?.id || null);

  React.useEffect(() => {
    setActiveId(attachedQuiz?.id || null);
  }, [attachedQuiz]);

  React.useEffect(() => {
    writeStoredQuizzes(savedQuizzes);
  }, [savedQuizzes]);

  const handleGenerate = React.useCallback(async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const totalQuestions = Math.max(1, Number(count) || 1);
      const result = await fakeAscendaIA({ topic: topic.trim(), count: totalQuestions });
      setQuiz({
        ...result,
        id: createId(),
        youtubeUrl: youtubeUrl.trim() || null,
        status: "draft",
      });
    } catch (error) {
      console.error("AscendaIA: generation failed", error);
      if (typeof window !== "undefined") {
        window.alert("AscendaIA could not generate the quiz. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [topic, count, youtubeUrl]);

  const handleSave = React.useCallback(() => {
    if (!quiz) return;

    setSavedQuizzes((current) => {
      const withoutCurrent = current.filter((item) => item.id !== quiz.id);
      const next = [...withoutCurrent, quiz];
      setActiveId(quiz.id);
      onAttach?.(quiz);

      if (typeof window !== "undefined") {
        window.alert("✅ Quiz saved locally!");
      }

      return next;
    });
  }, [onAttach, quiz]);

  const handleAttachStored = React.useCallback(
    (quizId) => {
      const found = savedQuizzes.find((item) => item.id === quizId) || null;
      setActiveId(found?.id || null);
      onAttach?.(found || null);
    },
    [onAttach, savedQuizzes],
  );

  const handleDeleteStored = React.useCallback(
    (quizId) => {
      setSavedQuizzes((current) => current.filter((item) => item.id !== quizId));
      if (activeId === quizId) {
        setActiveId(null);
        onAttach?.(null);
      }
    },
    [activeId, onAttach],
  );

  return (
    <section className="space-y-5 rounded-2xl border border-border/60 bg-surface/70 p-5 shadow-lg">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-white">🧠 AscendaIA — Smart Quiz Generator</h3>
        <p className="text-sm text-muted-foreground">
          Create quizzes from videos, documents, or topics. 100% front-end, no API key needed.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-lg bg-surface/60 p-2"
          placeholder="Training Topic (e.g. React Hooks)"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
        <input
          className="rounded-lg bg-surface/60 p-2"
          placeholder="YouTube link (optional)"
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
        />
        <input
          type="number"
          min={1}
          className="rounded-lg bg-surface/60 p-2"
          placeholder="Number of questions"
          value={count}
          onChange={(event) => setCount(Number(event.target.value) || 1)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className={generateButtonClass}
        >
          {loading ? "Generating..." : "✨ Generate with AscendaIA"}
        </button>
      </div>

      {loading && (
        <motion.p
          className="text-center text-sm text-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          AscendaIA is analyzing your content... 🧠
        </motion.p>
      )}

      {quiz && !loading && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-surface/80 p-4">
          <div>
            <h4 className="font-semibold text-white">
              ✅ Quiz generated: {quiz.topic} ({quiz.total} questions)
            </h4>
            {quiz.youtubeUrl && (
              <p className="text-xs text-muted-foreground">Source: {quiz.youtubeUrl}</p>
            )}
            <p className="text-xs text-muted-foreground">Created at {quiz.createdAt} by {quiz.createdBy}</p>
          </div>

          <ul className="space-y-1 text-sm text-muted-foreground">
            {quiz.questions.slice(0, 5).map((question) => (
              <li key={question.id}>• {question.prompt}</li>
            ))}
            {quiz.questions.length > 5 && (
              <li className="text-xs italic text-muted-foreground/80">
                …and {quiz.questions.length - 5} more questions
              </li>
            )}
          </ul>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-green-600/80 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-500/90"
            >
              Save quiz
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-border/50 bg-surface/70 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-muted-foreground">Saved quizzes</h4>
          {savedQuizzes.length > 0 && (
            <span className="text-xs text-muted-foreground">{savedQuizzes.length} saved</span>
          )}
        </div>

        {savedQuizzes.length === 0 ? (
          <p className="text-xs text-muted-foreground/80">
            No quizzes stored yet. Generate one above and save it to reuse later.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {savedQuizzes.map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border border-border/40 p-3 transition ${
                  item.id === activeId ? "border-green-500/70 bg-green-500/5" : "bg-surface/70"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{item.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.total} questions · {item.createdAt}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAttachStored(item.id)}
                      className="rounded-md bg-primary/80 px-3 py-1 text-xs font-semibold text-white hover:bg-primary"
                    >
                      Attach to course
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStored(item.id)}
                      className="rounded-md bg-red-600/70 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
