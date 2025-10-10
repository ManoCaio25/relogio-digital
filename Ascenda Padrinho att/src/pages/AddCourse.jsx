// AddCourse.jsx — sample form including the "Generate quizzes (AI)" block
// If your Add Course page already exists, copy the QUIZZES section
// and modal usage into your file.

import React from "react";
import { QuizGeneratorModal } from "../components/quizzes/QuizGeneratorModal";
import { QuizMiniPreview } from "../components/quizzes/QuizMiniPreview";

export default function AddCourse() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [trainingType, setTrainingType] = React.useState("");
  const [hours, setHours] = React.useState("5.5");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [files, setFiles] = React.useState([]);

  const [quizzes, setQuizzes] = React.useState(null); // { easy, intermediate, advanced }
  const [isGeneratorOpen, setGeneratorOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      category,
      difficulty,
      trainingType,
      hours: Number(hours),
      youtubeUrl: youtubeUrl || null,
      quizzes: quizzes
        ? {
            status: "draft",
            total:
              (quizzes?.easy?.length || 0) +
              (quizzes?.intermediate?.length || 0) +
              (quizzes?.advanced?.length || 0),
            bundle: quizzes,
          }
        : null,
    };

    // TODO: replace with your existing submit logic (API or local persistence)
    console.log("COURSE PAYLOAD:", payload);
    alert("Course payload printed in console. Plug your submit logic.");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-2xl font-bold">Add New Course</h2>

      <input
        placeholder="Course title"
        className="w-full rounded-lg bg-surface/50 p-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="What will the interns learn?"
        className="w-full rounded-lg bg-surface/50 p-3"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <select className="rounded-lg bg-surface/50 p-3" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          <option>Frontend</option>
          <option>Backend</option>
        </select>
        <select className="rounded-lg bg-surface/50 p-3" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Difficulty</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select className="rounded-lg bg-surface/50 p-3" value={trainingType} onChange={(e) => setTrainingType(e.target.value)}>
          <option value="">Training Type</option>
          <option>Video</option>
          <option>Reading</option>
          <option>Hybrid</option>
        </select>
        <input
          type="number"
          step="0.1"
          className="rounded-lg bg-surface/50 p-3"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>

      <input
        className="w-full rounded-lg bg-surface/50 p-3"
        placeholder="https://www.youtube.com/watch?v=..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="block w-full rounded-lg bg-surface/50 py-8 text-center"
      />

      {/* QUIZZES block */}
      <div className="rounded-2xl border border-border/60 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">Course Quizzes (AI)</h4>
            <p className="text-sm text-muted-foreground">
              Generate 20 questions (7 easy, 7 intermediate, 6 advanced) from link/files/text.
            </p>
          </div>
          <button type="button" onClick={() => setGeneratorOpen(true)} className="rounded-xl px-4 py-2 shadow hover:shadow-md">
            Generate quizzes (AI)
          </button>
        </div>

        {quizzes ? (
          <div className="mt-4">
            <QuizMiniPreview data={quizzes} />
            <p className="mt-2 text-xs text-muted-foreground">
              Quizzes will be saved along with the course. Reopen the generator to edit/replace.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No quizzes generated yet.</p>
        )}
      </div>

      <button type="submit" className="w-full rounded-xl bg-primary/80 py-3 font-semibold">
        Add course
      </button>

      {isGeneratorOpen && (
        <QuizGeneratorModal
          defaultYoutubeUrl={youtubeUrl}
          defaultFiles={files}
          defaultText={description}
          onClose={() => setGeneratorOpen(false)}
          onSave={(quizJson) => {
            setQuizzes(quizJson);
            setGeneratorOpen(false);
          }}
        />
      )}
    </form>
  );
}
