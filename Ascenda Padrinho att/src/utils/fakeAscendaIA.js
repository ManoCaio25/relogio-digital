const LEVEL_CONFIG = {
  easy: {
    label: "Easy",
    templates: [
      (topic) => `What is the main goal of ${topic}?`,
      (topic) => `Which statement best describes ${topic}?`,
      (topic) => `Why is ${topic} useful in day-to-day scenarios?`,
    ],
  },
  intermediate: {
    label: "Intermediate",
    templates: [
      (topic) => `How does ${topic} improve a project's architecture?`,
      (topic) => `Which option explains a recommended practice for ${topic}?`,
      (topic) => `What is a typical challenge when applying ${topic}?`,
    ],
  },
  advanced: {
    label: "Advanced",
    templates: [
      (topic) => `Which advanced technique unlocks the full potential of ${topic}?`,
      (topic) => `How can ${topic} be optimized for large-scale systems?`,
      (topic) => `Which trade-off is most relevant when mastering ${topic}?`,
    ],
  },
};

const DEFAULT_OPTIONS = ["Opção A", "Opção B", "Opção C", "Opção D"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildQuestion = (topic, level, index) => {
  const template = randomFrom(LEVEL_CONFIG[level].templates);
  const prompt = template(topic);
  const correctIndex = Math.floor(Math.random() * DEFAULT_OPTIONS.length);

  return {
    id: `${level}_${Date.now()}_${index}`,
    level,
    prompt,
    options: [...DEFAULT_OPTIONS],
    correctIndex,
  };
};

export function fakeAscendaIAByLevels({ topic, youtubeUrl, counts }) {
  return new Promise((resolve) => {
    const delay = 1600 + Math.random() * 400;
    setTimeout(() => {
      const createdAt = new Date().toISOString();
      const payload = {
        topic,
        source: youtubeUrl || null,
        createdBy: "AscendaIA 🤖",
        createdAt,
        easy: Array.from({ length: counts.easy || 0 }, (_, index) => buildQuestion(topic, "easy", index)),
        intermediate: Array.from(
          { length: counts.intermediate || 0 },
          (_, index) => buildQuestion(topic, "intermediate", index),
        ),
        advanced: Array.from({ length: counts.advanced || 0 }, (_, index) => buildQuestion(topic, "advanced", index)),
      };
      resolve(payload);
    }, delay);
  });
}

export const ASCENDA_LEVELS = [
  { id: "easy", label: "Easy" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];
