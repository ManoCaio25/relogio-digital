const pt = {
  common: {
    cancel: 'Cancelar',
    save: 'Salvar',
  },
  language: {
    english: 'English',
    portuguese: 'Português',
  },
  layout: {
    appName: 'Ascenda',
    subtitle: 'Portal do Gestor',
    navigation: 'Navegação',
    logout: 'Sair',
    navItems: {
      dashboard: 'Painel',
      interns: 'Equipe',
      content: 'Conteúdo',
      vacation: 'Férias',
      reports: 'Relatórios',
    },
    userFallback: 'Gestor',
  },
  dashboard: {
    title: 'Bem-vindo de volta, {{name}}!',
    subtitle: 'Veja o que está acontecendo com a sua equipe hoje',
    cards: {
      interns: {
        title: 'Estagiários',
        trend: '+2 este mês',
      },
      courses: {
        title: 'Cursos Disponíveis',
      },
      reviews: {
        title: 'Revisões Pendentes',
      },
      points: {
        title: 'Pontos da Equipe',
        trend: '+15%'
      },
    },
    status: {
      heading: 'Bem-estar dos Estagiários',
      count: '{{count}} estagiários',
      progressLabel: 'Progresso do Estágio',
      daysLeft: '{{count}} dias restantes',
      systemStatus: 'Status do Sistema',
      active: 'Ativo',
      paused: 'Pausado',
    },
    notifications: {
      pausedTitle: 'Estagiário Pausado',
      resumedTitle: 'Estagiário Retomado',
      pausedBody: 'Sistema de aprendizagem pausado para {{name}}',
      resumedBody: 'Sistema de aprendizagem retomado para {{name}}',
    },
  },
  interns: {
    title: 'Equipe',
    subtitle: 'Gerencie e acompanhe o progresso da equipe',
    searchPlaceholder: 'Buscar estagiários...',
    levelPlaceholder: 'Nível',
    statusPlaceholder: 'Status',
    filters: {
      allLevels: 'Todos os níveis',
      novice: 'Iniciante',
      apprentice: 'Aprendiz',
      journeyman: 'Intermediário',
      expert: 'Especialista',
      master: 'Mestre',
      allStatus: 'Todos os status',
      active: 'Ativo',
      paused: 'Pausado',
      completed: 'Concluído',
    },
    empty: 'Nenhum estagiário encontrado com esses filtros',
    card: {
      points: 'Pontos',
      avgScore: 'Média de {{value}}%',
      daysLeft: '{{count}}d restantes',
      chat: 'Conversar',
      trackFallback: 'Trilha de Aprendizagem',
      progressTitle: 'Bem-estar: {{status}}',
    },
  },
  content: {
    title: 'Gestão de Conteúdo',
    subtitle: 'Crie e gerencie materiais de treinamento para a equipe',
    libraryTitle: 'Biblioteca de Cursos',
    courseCount: '{{count}} cursos',
    empty: 'Nenhum curso ainda. Crie o primeiro!',
  },
  vacations: {
    title: 'Solicitações de Férias',
    subtitle: 'Revise e gerencie os pedidos de férias dos estagiários',
    panel: {
      heading: 'Solicitações de Férias',
      tabs: {
        list: 'Lista de Pedidos',
        calendar: 'Visão em Calendário',
      },
      filterPlaceholder: 'Filtrar',
      filters: {
        all: 'Todos os Pedidos',
        pending: 'Pendentes',
        approved: 'Aprovados',
        rejected: 'Rejeitados',
      },
      count: {
        one: '1 pedido',
        other: '{{count}} pedidos',
      },
      aria: {
        listItem: 'Pedido de férias de {{name}}',
        updateEmoji: 'Atualizar emoji de perfil de {{name}}',
        approve: 'Aprovar pedido de férias de {{name}}',
        reject: 'Rejeitar pedido de férias de {{name}}',
      },
      fields: {
        from: 'De',
        to: 'Até',
        reason: 'Motivo',
        managerNote: 'Nota do gestor:',
        requestedOn: 'Solicitado em {{date}}',
        trackFallback: 'Trilha de aprendizagem',
      },
      actions: {
        approve: 'Aprovar',
        reject: 'Rejeitar',
        saveEmoji: 'Salvar emoji',
        rejectRequest: 'Rejeitar pedido',
      },
      empty: 'Nenhum pedido de férias encontrado',
      emojiDialog: {
        title: 'Atualizar emoji do perfil',
        description: 'Escolha um emoji ou cole uma URL de imagem para {{name}}.',
        placeholder: 'Experimente 😀 ou cole uma URL de imagem',
        helper: 'Os emojis aparecem lindamente no aplicativo e você pode trocá-los quando quiser. URLs de imagem também são suportadas.',
        previewLabel: 'Pré-visualização',
      },
      rejectDialog: {
        title: 'Rejeitar solicitação de férias',
        description: 'Tem certeza de que deseja rejeitar esta solicitação de férias? Você pode adicionar uma nota opcional.',
        noteLabel: 'Nota do gestor (opcional)',
        notePlaceholder: 'Explique o motivo da rejeição...',
      },
      notifications: {
        approvedTitle: 'Solicitação de férias aprovada',
        approvedBody: 'Seu pedido de férias de {{start}} até {{end}} foi aprovado.',
        rejectedTitle: 'Solicitação de férias rejeitada',
        rejectedBody: 'Seu pedido de férias de {{start}} até {{end}} foi rejeitado.',
        noteSuffix: ' Observação: {{note}}',
      },
    },
  },
  reports: {
    title: 'Relatórios e Análises',
    subtitle: 'Insights sobre o desempenho e o progresso da equipe',
    export: 'Exportar relatório',
    charts: {
      teamPerformance: 'Desempenho da equipe (Top 10)',
      taskDistribution: 'Distribuição de tarefas',
      statuses: {
        completed: 'Concluídas',
        in_progress: 'Em andamento',
        pending: 'Pendentes',
        overdue: 'Atrasadas',
        empty: 'Nenhum dado de tarefas disponível',
      },
      performanceEmpty: 'Nenhum dado de desempenho disponível',
      legendPoints: 'Pontos',
    },
    metrics: {
      title: 'Resumo de métricas',
      totalInterns: 'Total de estagiários',
      activeTasks: 'Tarefas ativas',
      availableCourses: 'Cursos disponíveis',
      avgPoints: 'Pontuação média',
    },
  },
};

export default pt;
