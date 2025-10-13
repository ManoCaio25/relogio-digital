import { i18n } from '@/i18n';

function buildQuestion(level, index, topic, source) {
  const promptKey = {
    easy: 'ascendaQuiz.preview.samples.quickCheckN',
    intermediate: 'ascendaQuiz.preview.samples.scenarioN',
    advanced: 'ascendaQuiz.preview.samples.challengeN',
  }[level];

  const prompt = i18n.t(promptKey ?? 'ascendaQuiz.preview.samples.quickCheckN', {
    n: index + 1,
    topic,
  });

  const options = ['Option A', 'Option B', 'Option C', 'Option D'];

  return {
    id: `${level}-${Date.now()}-${index}`,
    level,
    prompt,
    options,
    correctIndex: Math.floor(Math.random() * options.length),
    source,
  };
}

async function fakeAscendaIAByLevels(request) {
  const { topic, youtubeUrl, textContent, counts } = request;

  const sourceLabel = youtubeUrl
    ? i18n.t('ascendaQuiz.preview.sourceLabel.youtube')
    : textContent
        ? i18n.t('ascendaQuiz.preview.sourceLabel.document')
        : topic;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await wait(1200 + Math.random() * 600);

  const buildList = (level) => {
    const count = Math.max(0, Number(counts?.[level] ?? 0));
    return Array.from({ length: count }, (_, index) =>
      buildQuestion(level, index, topic, sourceLabel),
    );
  };

  const now = new Date();

  return {
    topic,
    source: sourceLabel,
    createdBy: 'AscendaIA 🤖',
    createdAt: now.toISOString(),
    easy: buildList('easy'),
    intermediate: buildList('intermediate'),
    advanced: buildList('advanced'),
  };
}

export const ascendaIAClient = {
  async generateQuizzes(request) {
    return fakeAscendaIAByLevels(request);
  },
};
