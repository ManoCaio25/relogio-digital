export const MOCK_THREADS = [
  {
    id: 'f1',
    title: 'Dicas para o primeiro projeto',
    participants: ['u2', 'u3', 'u1'],
    messages: [
      {
        id: 'm1',
        author: 'u2',
        content: 'Quais entregáveis vocês priorizam nas primeiras semanas?',
        createdAt: new Date().toISOString()
      },
      {
        id: 'm2',
        author: 'u1',
        content: 'Foquem em entender o contexto do cliente e mapear riscos.',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'f2',
    title: 'Recomendações de cursos',
    participants: ['u4', 'u5', 'u6'],
    messages: [
      {
        id: 'm3',
        author: 'u4',
        content: 'Quais cursos de SAP vocês indicam?',
        createdAt: new Date().toISOString()
      },
      {
        id: 'm4',
        author: 'u5',
        content: 'O SAP Learning Hub tem uma trilha excelente para iniciantes.',
        createdAt: new Date().toISOString()
      }
    ]
  }
];
