// QuizMiniPreview.jsx — small counters per level

export function QuizMiniPreview({ data }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="rounded-lg border p-3">
        <div className="font-semibold">Easy</div>
        <div>{data?.easy?.length || 0} questions</div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="font-semibold">Intermediate</div>
        <div>{data?.intermediate?.length || 0} questions</div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="font-semibold">Advanced</div>
        <div>{data?.advanced?.length || 0} questions</div>
      </div>
    </div>
  );
}
