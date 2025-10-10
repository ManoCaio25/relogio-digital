import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fakeAscendaIA } from "@/utils/fakeAscendaIA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendToInternModal } from "./SendToInternModal";

const baseOverlay = "fixed inset-0 z-[999] grid place-items-center bg-black/70 p-4";

export function AscendaIAGenerator({
  open,
  mode = "create",
  request,
  initialQuiz,
  onClose,
  onSave,
}) {
  const [status, setStatus] = React.useState(mode === "edit" ? "ready" : "loading");
  const [quiz, setQuiz] = React.useState(initialQuiz || null);
  const [assignedTo, setAssignedTo] = React.useState(initialQuiz?.assignedTo || []);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (mode === "edit") {
      setStatus("ready");
      setQuiz(initialQuiz || null);
      setAssignedTo(initialQuiz?.assignedTo || []);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setStatus("loading");
      try {
        const generated = await fakeAscendaIA({
          topic: request?.topic,
          count: request?.count,
        });
        if (cancelled) return;
        setQuiz({
          ...generated,
          sourceType: request?.sourceType || "Text only",
          youtubeUrl: request?.youtubeUrl || "",
          fileName: request?.fileName || "",
          status: "draft",
        });
        setAssignedTo([]);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to simulate AscendaIA", error);
        setStatus("error");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [open, mode, request, initialQuiz]);

  const updateQuestion = (index, patch) => {
    setQuiz((prev) => {
      if (!prev) return prev;
      const nextQuestions = prev.questions.map((question, idx) =>
        idx === index ? { ...question, ...patch } : question,
      );
      return { ...prev, questions: nextQuestions };
    });
  };

  const updateOption = (qIndex, optionIndex, value) => {
    setQuiz((prev) => {
      if (!prev) return prev;
      const nextQuestions = prev.questions.map((question, idx) => {
        if (idx !== qIndex) return question;
        const options = question.options.map((opt, optIdx) =>
          optIdx === optionIndex ? value : opt,
        );
        return { ...question, options };
      });
      return { ...prev, questions: nextQuestions };
    });
  };

  const handleSave = () => {
    if (!quiz) return;
    onSave({
      ...quiz,
      assignedTo,
      total: quiz.questions.length,
      status: assignedTo.length ? "assigned" : quiz.status || "draft",
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={baseOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="h-full w-full max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-surface p-6 shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">AscendaIA is crafting your quiz</h2>
                {request?.topic && (
                  <p className="text-sm text-muted-foreground">Topic: {request.topic}</p>
                )}
              </div>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>

            {status === "loading" && (
              <div className="mt-10 flex flex-col items-center gap-6 text-center">
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-primary/60 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                />
                <div>
                  <p className="text-lg font-medium">AscendaIA is analyzing your content...</p>
                  <p className="text-sm text-muted-foreground">
                    Scanning {request?.sourceType?.toLowerCase() || "text"} and building smart questions.
                  </p>
                </div>
              </div>
            )}

            {status === "ready" && quiz && (
              <div className="mt-6 flex h-[65vh] flex-col gap-5 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm text-primary"
                >
                  <p>
                    ✅ Quiz generated: <span className="font-semibold">{quiz.topic}</span> ({" "}
                    {quiz.questions.length} questions)
                  </p>
                  <p className="text-xs text-primary/70">
                    {quiz.createdBy} • {quiz.createdAt}
                  </p>
                </motion.div>

                <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto pr-2">
                  {quiz.questions.map((question, index) => (
                    <motion.div
                      key={question.id || index}
                      className="rounded-2xl border border-border/60 bg-surface/80 p-4 shadow"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                        <span className="font-semibold text-primary/80">{question.level}</span>
                        <span>Q{index + 1}</span>
                      </div>
                      <Textarea
                        className="mt-2 text-base"
                        value={question.prompt}
                        onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
                      />
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`rounded-xl border p-3 text-sm transition ${
                              question.correctIndex === optionIndex
                                ? "border-emerald-400/80 bg-emerald-400/10"
                                : "border-border/60 bg-surface/70"
                            }`}
                          >
                            <Input
                              value={option}
                              onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                              className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                            />
                            <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <input
                                type="radio"
                                checked={question.correctIndex === optionIndex}
                                onChange={() => updateQuestion(index, { correctIndex: optionIndex })}
                              />
                              Correct answer
                            </label>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-border/60 pt-4">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setAssignModalOpen(true)}
                    className="bg-blue-500 text-white hover:bg-blue-500/90"
                  >
                    Send to intern
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg hover:from-purple-400 hover:via-fuchsia-400 hover:to-indigo-400"
                  >
                    Save quiz
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-10 text-center">
                <p className="text-lg font-semibold text-red-400">AscendaIA could not generate the quiz.</p>
                <p className="text-sm text-muted-foreground">Please try again.</p>
              </div>
            )}
          </motion.div>

          <SendToInternModal
            open={assignModalOpen}
            initialSelected={assignedTo}
            onClose={() => setAssignModalOpen(false)}
            onSave={(selection) => {
              setAssignedTo(selection);
              setAssignModalOpen(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
