export const MOCK_QUIZZES = [
  {
    id: 'q1',
    title: 'Fundamentos de IA',
    tags: ['IA', 'Python'],
    difficulty: 'Médio',
    content: 'Perguntas sobre IA aplicada ao negócio.'
  },
  {
    id: 'q2',
    title: 'Machine Learning aplicado',
    tags: ['Machine Learning'],
    difficulty: 'Avançado',
    content: 'Classificação, regressão e métricas.'
  },
  {
    id: 'q3',
    title: 'Introdução ao SAP',
    tags: ['SAP'],
    difficulty: 'Básico',
    content: 'Conceitos principais do SAP.'
  },
  {
    id: 'q4',
    title: 'Power BI Stories',
    tags: ['Dados'],
    difficulty: 'Médio',
    content: 'Dashboards interativos e DAX.'
  },
  {
    id: 'q5',
    title: 'Gerência de Projetos Ágil',
    tags: ['PMO'],
    difficulty: 'Médio',
    content: 'Scrum e Kanban na prática.'
  }
];

export const MOCK_INBOX = {
  u2: ['q1', 'q2', 'q4'],
  u3: ['q3', 'q5', 'q1'],
  u4: ['q3', 'q5', 'q2'],
  u5: ['q3', 'q4', 'q5'],
  u6: ['q4', 'q1', 'q2'],
  u7: ['q1', 'q2', 'q5']
};
