const STORAGE_KEY = "ascenda_quizzes";

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const difficultyLabels = {
  easy: "Iniciante",
  medium: "Intermediário",
  hard: "Avançado",
};

function randomId(prefix = "quiz") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createOptionText(topic, difficulty, index) {
  const base = difficultyLabels[difficulty] || "Questão";
  const letter = String.fromCharCode(65 + index);
  return `${letter}) ${base} sobre ${topic}`;
}

function makeFakeQuestions(topic, difficulty, amount) {
  const total = Number(amount) || 0;
  return Array.from({ length: total }, (_, idx) => {
    const answerIndex = Math.floor(Math.random() * 4);
    const options = Array.from({ length: 4 }, (_, optIdx) =>
      createOptionText(topic, difficulty, optIdx),
    );

    return {
      id: `${difficulty}-${idx + 1}`,
      question: `(${idx + 1}) ${topic} — cenário ${difficultyLabels[difficulty] || ""}`.trim(),
      options,
      answerIndex,
    };
  });
}

function readStorage() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("quizService: unable to read localStorage", error);
    return {};
  }
}

function writeStorage(data) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("quizService: unable to write localStorage", error);
  }
}

export const quizService = {
  async generate({ topic, difficulty, amount }) {
    await wait(800);

    const normalizedTopic = topic.trim();
    const quizId = randomId("quiz");
    const items = makeFakeQuestions(normalizedTopic, difficulty, amount);

    return {
      quizId,
      items,
    };
  },

  async save({ courseId, quizId, items }) {
    await wait(200);

    const db = readStorage();
    if (!db[courseId]) {
      db[courseId] = {};
    }

    db[courseId][quizId] = {
      items,
      savedAt: Date.now(),
    };

    writeStorage(db);
    return { ok: true };
  },
};
