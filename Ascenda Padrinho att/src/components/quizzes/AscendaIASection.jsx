import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AscendaIAGenerator } from "./AscendaIAGenerator";
import { SendToInternModal } from "./SendToInternModal";
import { interns } from "@/data/interns";

const STORAGE_KEY = "ascenda_quizzes";

const createId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `quiz_${Date.now()}`);

export function AscendaIASection({ attachedQuiz, onAttach }) {
  const [topic, setTopic] = React.useState("");
  const [sourceType, setSourceType] = React.useState("Video");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [questionCount, setQuestionCount] = React.useState(10);
  const [quizzes, setQuizzes] = React.useState([]);
  const [generatorState, setGeneratorState] = React.useState({
    open: false,
    mode: "create",
    request: null,
    quiz: null,
  });
  const [assignModalData, setAssignModalData] = React.useState({ open: false, quizId: null });
  const [attachedId, setAttachedId] = React.useState(attachedQuiz?.id || null);

  React.useEffect(() => {
    setAttachedId(attachedQuiz?.id || null);
  }, [attachedQuiz]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setQuizzes(parsed);
      }
    } catch (error) {
      console.error("Failed to parse stored quizzes", error);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  const openGenerator = React.useCallback(
    (mode, request, quiz) => {
      setGeneratorState({ open: true, mode, request, quiz });
    },
    [],
  );

  const handleGenerate = () => {
    openGenerator("create", { topic, count: questionCount, sourceType, youtubeUrl, fileName }, null);
  };

  const closeGenerator = () => setGeneratorState({ open: false, mode: "create", request: null, quiz: null });

  const handleDelete = (quizId) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    if (attachedId === quizId) {
      setAttachedId(null);
      onAttach?.(null);
    }
  };

  const handleAssignFromList = (quizId, selectedIds) => {
    setQuizzes((prev) => {
      const updated = prev.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              assignedTo: selectedIds,
              status: selectedIds.length ? "assigned" : "draft",
            }
          : quiz,
      );
      if (attachedId === quizId) {
        const refreshed = updated.find((quiz) => quiz.id === quizId) || null;
        handleAttach(refreshed);
      }
      return updated;
    });
  };

  const assignedNames = (ids = []) =>
    ids
      .map((id) => interns.find((intern) => intern.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const handleAttach = (quiz) => {
    setAttachedId(quiz?.id || null);
    onAttach?.(quiz || null);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 shadow-lg">
      <div className="mb-4 space-y-1">
        <h3 className="text-xl font-semibold">🧠 AscendaIA – Smart Quiz Generator</h3>
        <p className="text-sm text-muted-foreground">
          Create customized quizzes from videos, documents, or training topics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic / Subject</label>
          <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. React Hooks" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Source type</label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Document">Document</SelectItem>
              <SelectItem value="Text only">Text only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">YouTube link (optional)</label>
          <Input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload material (optional)</label>
          <Input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileName(file ? file.name : "");
            }}
          />
          {fileName && <p className="text-xs text-muted-foreground">Attached: {fileName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Number of questions</label>
          <Input
            type="number"
            min={1}
            max={50}
            value={questionCount}
            onChange={(event) => setQuestionCount(Number(event.target.value) || 1)}
          />
        </div>

      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          onClick={handleGenerate}
          className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg hover:from-purple-400 hover:via-fuchsia-400 hover:to-indigo-400"
        >
          ✨ Generate with AscendaIA
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Generated quizzes</h4>
        <AnimatePresence initial={false}>
          {quizzes.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm text-muted-foreground"
            >
              No quizzes generated yet. Use AscendaIA to craft your first assessment.
            </motion.p>
          ) : (
            quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`rounded-2xl border p-4 transition ${
                  attachedId === quiz.id ? "border-primary/70 bg-primary/10" : "border-border/60 bg-surface/60"
                }`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-sm text-primary">
                      ✅ Quiz generated: {quiz.topic} ({quiz.questions.length} questions)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quiz.createdBy} • {quiz.createdAt}
                    </p>
                    {quiz.assignedTo?.length ? (
                      <p className="text-xs text-blue-300">Assigned to: {assignedNames(quiz.assignedTo)}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not sent to interns yet.</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openGenerator("edit", null, quiz)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAssignModalData({ open: true, quizId: quiz.id })}
                    >
                      Assign
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAttach(quiz)}
                      className={attachedId === quiz.id ? "text-primary" : ""}
                    >
                      {attachedId === quiz.id ? "Attached" : "Attach"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(quiz.id)} className="text-red-400">
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AscendaIAGenerator
        open={generatorState.open}
        mode={generatorState.mode}
        request={generatorState.request}
        initialQuiz={generatorState.quiz}
        onClose={closeGenerator}
        onSave={(quizData) => {
          if (generatorState.mode === "edit" && generatorState.quiz) {
            setQuizzes((prev) =>
              prev.map((quiz) =>
                quiz.id === generatorState.quiz.id
                  ? {
                      ...generatorState.quiz,
                      ...quizData,
                    }
                  : quiz,
              ),
            );
            if (attachedId === generatorState.quiz.id) {
              handleAttach({ ...generatorState.quiz, ...quizData });
            }
          } else {
            const newQuiz = {
              id: createId(),
              ...quizData,
              topic: quizData.topic,
              sourceType: generatorState.request?.sourceType || quizData.sourceType || "Text only",
              youtubeUrl: generatorState.request?.youtubeUrl || quizData.youtubeUrl || "",
              fileName: generatorState.request?.fileName || quizData.fileName || "",
            };
            setQuizzes((prev) => [newQuiz, ...prev]);
            handleAttach(newQuiz);
          }
          setGeneratorState({ open: false, mode: "create", request: null, quiz: null });
        }}
      />

      <SendToInternModal
        open={assignModalData.open}
        initialSelected={quizzes.find((quiz) => quiz.id === assignModalData.quizId)?.assignedTo || []}
        onClose={() => setAssignModalData({ open: false, quizId: null })}
        onSave={(ids) => {
          if (!assignModalData.quizId) return;
          handleAssignFromList(assignModalData.quizId, ids);
          setAssignModalData({ open: false, quizId: null });
        }}
      />
    </div>
  );
}
