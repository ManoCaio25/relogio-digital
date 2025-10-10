export async function fakeAscendaIA({ topic, count }) {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const levels = ["easy", "intermediate", "advanced"];
  const total = Math.max(1, Number(count) || 1);
  const safeTopic = topic?.trim() || "your topic";

  const questions = Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    level: levels[index % levels.length],
    prompt: `Question ${index + 1} about ${safeTopic}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: Math.floor(Math.random() * 4),
  }));

  return {
    topic: safeTopic,
    total,
    createdBy: "AscendaIA 🤖",
    createdAt: new Date().toLocaleString(),
    questions,
  };
}
