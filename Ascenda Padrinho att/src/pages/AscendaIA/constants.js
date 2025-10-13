export const QUIZ_LEVELS = [
  {
    code: 'easy',
    accent: 'sky',
    defaultCount: 4,
    titleKey: 'ascendaQuiz.levels.basic',
    descriptionKey: 'ascendaQuiz.levels.basicDesc',
  },
  {
    code: 'intermediate',
    accent: 'violet',
    defaultCount: 4,
    titleKey: 'ascendaQuiz.levels.intermediate',
    descriptionKey: 'ascendaQuiz.levels.intermediateDesc',
  },
  {
    code: 'advanced',
    accent: 'fuchsia',
    defaultCount: 2,
    titleKey: 'ascendaQuiz.levels.advanced',
    descriptionKey: 'ascendaQuiz.levels.advancedDesc',
  },
];

export const MAX_ITEMS_PER_LEVEL = 50;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const LEVEL_ACCENTS = {
  easy: 'sky',
  intermediate: 'violet',
  advanced: 'fuchsia',
};
