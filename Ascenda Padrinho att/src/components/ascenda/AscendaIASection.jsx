import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Youtube, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fakeAscendaIAByLevels } from "@/utils/fakeAscendaIA";

const LEVEL_META = {
  easy: {
    label: "Easy",
    description: "Quick wins and warm-ups",
    accent: "border-emerald-500/40 bg-emerald-500/5",
  },
  intermediate: {
    label: "Intermediate",
    description: "Scenario-based reasoning",
    accent: "border-sky-500/40 bg-sky-500/5",
  },
  advanced: {
    label: "Advanced",
    description: "Strategic and architectural depth",
    accent: "border-fuchsia-500/40 bg-fuchsia-500/5",
  },
};

const INITIAL_COUNTS = {
  easy: 4,
  intermediate: 3,
  advanced: 2,
};

export default function AscendaIASection() {
  // Form state
  const [topic, setTopic] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [enabledLevels, setEnabledLevels] = useState({
    easy: true,
    intermediate: true,
    advanced: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [lastSavedId, setLastSavedId] = useState(null);

  // Derived values to control generation UX
  const requestedCounts = useMemo(() => {
    return Object.entries(counts).reduce((acc, [level, amount]) => {
      return acc + (enabledLevels[level] ? Number(amount || 0) : 0);
    }, 0);
  }, [counts, enabledLevels]);
  const canGenerate = topic.trim().length > 0 && requestedCounts > 0;
  const easyCount = preview ? preview.easy.length : 0;
  const intermediateCount = preview ? preview.intermediate.length : 0;
  const advancedCount = preview ? preview.advanced.length : 0;
  const totalGenerated = easyCount + intermediateCount + advancedCount;

  const toggleLevel = (level) => {
    setEnabledLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const updateCount = (level, value) => {
    const numeric = Math.max(1, Number(value) || 0);
    setCounts((prev) => ({
      ...prev,
      [level]: numeric,
    }));
  };

  const handleGenerate = async () => {
    const trimmedTopic = topic.trim();
    const sanitizedCounts = Object.fromEntries(
      Object.entries(counts).map(([level, amount]) => [level, enabledLevels[level] ? Number(amount) : 0]),
    );

    if (!trimmedTopic) {
      setError("Provide a topic so AscendaIA knows what to study.");
      return;
    }

    if (Object.values(sanitizedCounts).every((count) => count === 0)) {
      setError("Choose at least one difficulty level to generate questions.");
      return;
    }

    setError("");
    setIsGenerating(true);
    setPreview(null);
    setLastSavedId(null);

    try {
      // Simulate an AscendaIA call entirely on the client side
      const result = await fakeAscendaIAByLevels({
        topic: trimmedTopic,
        youtubeUrl: youtubeUrl.trim() || null,
        counts: sanitizedCounts,
      });
      setPreview(result);
    } catch (err) {
      console.error("AscendaIA mock failed", err);
      setError("Something unexpected happened while generating the quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDiscard = () => {
    setPreview(null);
    setLastSavedId(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ascenda-quiz-discarded"));
    }
  };

  const handleSave = () => {
    if (!preview) return;

    const breakdown = {
      easy: preview.easy.length,
      intermediate: preview.intermediate.length,
      advanced: preview.advanced.length,
    };
    const items = [...preview.easy, ...preview.intermediate, ...preview.advanced];
    const quizBundle = {
      id: `quiz_${Date.now()}`,
      topic: preview.topic,
      source: preview.source,
      createdBy: preview.createdBy,
      createdAt: preview.createdAt,
      items,
      breakdown,
      status: "draft",
    };

    try {
      if (typeof window !== "undefined") {
        // Persist in localStorage so the draft survives refreshes
        const existingRaw = window.localStorage.getItem("ascenda_quizzes");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = [...existing, quizBundle];
        window.localStorage.setItem("ascenda_quizzes", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("ascenda-quiz-saved", { detail: quizBundle }));
      }
      setLastSavedId(quizBundle.id);
    } catch (err) {
      console.error("Unable to persist AscendaIA quiz", err);
      setError("Could not save the quiz locally. Check storage permissions.");
      return;
    }
  };

  const renderLevelPreview = (levelKey, questions) => {
    const meta = LEVEL_META[levelKey];
    return (
      <div
        key={levelKey}
        className={`space-y-3 rounded-xl border ${meta.accent} p-4 backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">{meta.label}</p>
            <p className="text-xs text-muted">{meta.description}</p>
          </div>
          <span className="text-sm font-semibold text-muted">{questions.length}</span>
        </div>
        {questions.length > 0 ? (
          <ul className="space-y-2 text-xs text-muted">
            {questions.slice(0, 4).map((question) => (
              <li key={question.id} className="leading-relaxed">
                • {question.prompt}
              </li>
            ))}
            {questions.length > 4 ? (
              <li className="italic text-muted/80">…and more</li>
            ) : null}
          </ul>
        ) : (
          <p className="text-xs italic text-muted/70">Not requested for this run.</p>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6 rounded-2xl border border-border/60 bg-surface2/70 p-6 shadow-e1">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">🧠 AscendaIA — Smart Quiz Generator</h3>
        <p className="text-sm text-muted">
          Generate questions from a topic or a YouTube link. Choose difficulty levels and counts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ascenda-topic">Topic</Label>
          <Input
            id="ascenda-topic"
            placeholder="e.g. React Hooks best practices"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ascenda-youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-error" />
            <span>YouTube link (optional)</span>
          </Label>
          <Input
            id="ascenda-youtube"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border/50 bg-surface/60 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          {Object.keys(LEVEL_META).map((level) => (
            <div
              key={level}
              className={`rounded-xl border border-border/50 bg-surface2/70 p-3 transition-colors ${
                enabledLevels[level] ? "ring-1 ring-brand/40" : "opacity-60"
              }`}
            >
              <label className="flex items-center justify-between gap-2 text-sm font-medium text-primary">
                <span>{LEVEL_META[level].label}</span>
                <input
                  type="checkbox"
                  checked={enabledLevels[level]}
                  onChange={() => toggleLevel(level)}
                  className="h-4 w-4 accent-brand"
                />
              </label>
              <p className="mt-1 text-xs text-muted">{LEVEL_META[level].description}</p>
              <div className="mt-3">
                <Label htmlFor={`count-${level}`} className="text-xs text-muted">
                  Questions
                </Label>
                <Input
                  id={`count-${level}`}
                  type="number"
                  min={1}
                  value={counts[level]}
                  onChange={(event) => updateCount(level, event.target.value)}
                  disabled={!enabledLevels[level]}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted">
            Total requested: <span className="font-semibold text-brand">{requestedCounts}</span>
          </p>
          <Button
            type="button"
            className="inline-flex items-center gap-2 bg-brand text-white hover:bg-brand/90"
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
          >
            <Sparkles className="h-4 w-4" />
            ✨ Generate with AscendaIA
          </Button>
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
      </div>

      <AnimatePresence>
        {isGenerating ? (
          <motion.div
            key="ascenda-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm text-brand"
          >
            <motion.span
              className="inline-flex h-3 w-3 rounded-full bg-brand"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            AscendaIA is analyzing your content…
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {preview ? (
          <motion.div
            key="ascenda-preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6 rounded-2xl border border-border/60 bg-surface/70 p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-base font-semibold text-primary">Quiz preview</h4>
                <p className="text-xs text-muted">
                  {preview.topic} • Total of {totalGenerated} questions
                </p>
              </div>
              {lastSavedId ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {renderLevelPreview("easy", preview.easy)}
              {renderLevelPreview("intermediate", preview.intermediate)}
              {renderLevelPreview("advanced", preview.advanced)}
            </div>

            <p className="text-sm text-muted">
              Breakdown · Easy {easyCount} • Intermediate {intermediateCount} • Advanced {advancedCount}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Created by {preview.createdBy} · {new Date(preview.createdAt).toLocaleString()}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={handleDiscard} className="border-border/60 text-muted hover:bg-surface2/80">
                  Discard
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-500 text-white hover:bg-emerald-500/90"
                  onClick={handleSave}
                >
                  Save quiz
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
