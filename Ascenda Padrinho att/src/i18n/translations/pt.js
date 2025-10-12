const pt = {
  common: {
    appName: "Ascenda",
    managerPortal: "Portal do Gestor",
    navigation: "Navegação",
    manager: "Gestor",
    actions: {
      logout: "Sair",
      cancel: "Cancelar",
      save: "Salvar",
      approve: "Aprovar",
      reject: "Rejeitar",
      preview: "Pré-visualizar",
      edit: "Editar",
      assign: "Atribuir",
      assignTo: "Atribuir a",
      markAllRead: "Marcar tudo como lido",
      export: "Exportar relatório",
      exportCsv: "Exportar CSV",
      upload: "Adicionar curso",
      uploading: "Enviando...",
      saveChanges: "Salvar alterações",
      saving: "Salvando...",
      today: "Hoje",
      startCourse: "Iniciar curso",
      markCompleted: "Marcar como concluído",
      assignCourse: "Atribuir curso",
      close: "Fechar",
      chat: "Chat",
      view: "Ver",
      open: "Abrir",
      saveEmoji: "Salvar emoji"
    },
    status: {
      active: "Ativo",
      paused: "Pausado",
      completed: "Concluído",
      approved: "Aprovado",
      rejected: "Rejeitado",
      pending: "Pendente",
      assigned: "Atribuído",
      inProgress: "Em andamento",
      overdue: "Em atraso"
    },
    filters: {
      level: "Nível",
      status: "Status",
      allLevels: "Todos os níveis",
      allStatus: "Todos os status",
      allRequests: "Todas as solicitações",
      filter: "Filtrar"
    },
    languages: {
      en: "English",
      pt: "Português"
    },
    placeholders: {
      searchInterns: "Pesquisar estagiários...",
      courseTitleExample: "ex.: Padrões Avançados de React",
      courseDescription: "O que os estagiários vão aprender?",
      youtubeUrl: "https://www.youtube.com/watch?v=...",
      uploadPrompt: "Clique para enviar PDF, vídeo, imagem ou arquivo do Office",
      rejectionReason: "Explique o motivo da rejeição...",
      notes: "Adicione instruções ou contexto...",
      emojiInput: "Experimente 😀 ou cole uma URL de imagem"
    },
    labels: {
      language: "Idioma",
      descriptionOptional: "Descrição",
      preview: "Pré-visualização",
      durationHours: "Duração (horas)",
      youtubeOptional: "Link do YouTube (opcional)",
      materialsOptional: "Materiais do curso (opcional)",
      dueDateOptional: "Data limite (opcional)",
      notesOptional: "Observações (opcional)",
      managerNoteOptional: "Nota do gestor (opcional)",
      previewTitle: "Pré-visualização"
    },
    time: {
      daysLeft: "{{count}} dias restantes",
      requestedOn: "Solicitado em {{date}}",
      monthYear: "MMMM 'de' yyyy",
      dayMonth: "d 'de' MMM",
      dayMonthYear: "d 'de' MMM',' yyyy",
      monthDayTime: "d 'de' MMM, HH:mm"
    },
    counts: {
      interns: "{{count}} estagiário{{suffix}}",
      requests: "{{count}} solicitação{{suffix}}",
      conflicts: "{{count}} conflito{{suffix}} de agenda detectado",
      selectedInterns: "{{count}} estagiário{{suffix}} selecionado",
      assignments: "Atribuições de cursos ativas ({{count}})"
    },
    misc: {
      unknown: "Desconhecido",
      learningTrack: "Trilha de aprendizado",
      progress: "Progresso",
      avg: "média",
      file: "Arquivo",
      preview: "Prévia",
      courseLibraryCount: "{{count}} cursos",
      internsCount: "{{count}} estagiário{{suffix}}",
      emojiHelp: "Emojis ficam ótimos no app e você pode trocá-los quando quiser. URLs de imagens também são suportadas.",
      updateProfileEmoji: "Atualizar emoji do perfil de {{name}}",
      emojiPreviewAlt: "Prévia do avatar do estagiário"
    }
  },
  layout: {
    sidebarTagline: "Portal do Gestor",
    nav: {
      dashboard: "Dashboard",
      interns: "Equipe",
      content: "Gestão de conteúdo",
      ascendaIA: {
        title: "AscendaIA",
        subtitle: "Gerador de Quiz",
      },
      vacation: "Férias",
      reports: "Relatórios"
    },
    languageToggle: {
      label: "Idioma",
      english: "English",
      portuguese: "Português"
    }
  },
  dashboard: {
    welcome: "Bem-vindo de volta, {{name}}!",
    subtitle: "Veja o que está acontecendo com a sua equipe hoje",
    summary: {
      totalInterns: "Total de estagiários",
      courses: "Cursos disponíveis",
      reviews: "Revisões pendentes",
      points: "Pontos da equipe",
      trend: "+2 este mês",
      pointsTrend: "+15%"
    },
    sectionTitle: "Status e bem-estar dos estagiários",
    status: {
      heading: "Status e bem-estar dos estagiários",
      count: "{{count}} estagiário{{suffix}}",
      progressLabel: "Progresso do estágio",
      daysLeft: "{{count}} dias restantes",
      systemStatus: "Status do sistema",
      active: "Ativo",
      paused: "Pausado",
    },
    performanceChart: {
      noData: "Nenhum dado de performance disponível",
      legendLabel: "Pontuação de performance",
      tooltipLabel: "{{label}}",
      tooltipValue: "{{value}}%",
      percentValue: "{{value}}%",
    },
    notifications: {
      pausedTitle: "Estagiário pausado",
      resumedTitle: "Estagiário retomado",
      pausedBody: "Sistema de aprendizagem pausado para {{name}}",
      resumedBody: "Sistema de aprendizagem retomado para {{name}}",
    }
  },
  internsPage: {
    title: "Equipe",
    subtitle: "Gerencie e acompanhe o progresso da sua equipe",
    noResults: "Nenhum estagiário encontrado com os filtros selecionados",
    levels: {
      novice: "Novato",
      apprentice: "Aprendiz",
      journeyman: "Profissional",
      expert: "Especialista",
      master: "Mestre"
    }
  },
  interns: {
    tracks: {
      javascriptReact: "JavaScript + React",
      sapPmo: "SAP + PMO",
      sap: "SAP",
      sapHr: "SAP HR",
      sapHrPmo: "SAP HR + PMO",
      sapHrGoogle: "SAP HR + Google",
      powerBi: "Power BI",
      aiPython: "IA + Python",
      google: "Google",
      googleWorkspace: "Google Workspace",
      webDevelopment: "Desenvolvimento Web",
    }
  },
  internStatus: {
    tooltip: "Bem-estar: {{status}}",
    trackFallback: "Trilha de aprendizado",
    internshipProgress: "Progresso do estágio",
    daysLeft: "{{count}} dias restantes",
    systemStatus: "Status do sistema",
    labels: {
      excellent: "Excelente",
      good: "Bom",
      neutral: "Neutro",
      stressed: "Estressado",
      overwhelmed: "Sobrecarregado"
    }
  },
  internCard: {
    points: "Pontos:",
    average: "{{value}}% média",
    daysLeftShort: "{{count}}d restantes",
    chat: "Chat"
  },
  internDetails: {
    totalPoints: "Total de pontos",
    tasksDone: "Tarefas concluídas",
    startDate: "Data de início",
    endDate: "Data de término",
    daysLeft: "{{count}} dias restantes",
    tabs: {
      performance: "Performance",
      courses: "Cursos ativos"
    },
    skills: "Competências",
    noPerformance: "Ainda não há dados de performance"
  },
  performance: {
    title: "Insights de performance",
    currentScore: "Pontuação atual",
    average: "Média 3 meses",
    completed: "Concluídos",
    studyHours: "Horas de estudo",
    target: "Meta 85%",
    completionSeries: "Conclusão %",
    scoreSeries: "Pontuação %",
    pointsSeries: "Pontos",
    tooltip: {
      score: "Pontuação:",
      completion: "Conclusão:",
      points: "Pontos:",
      hours: "Horas:"
    },
    export: "Exportar CSV"
  },
  assignments: {
    title: "Atribuições de cursos ativas",
    none: "Nenhuma atribuição de curso ativa",
    assigned: "Atribuído",
    inProgress: "Em andamento",
    progress: "Progresso",
    assignedOn: "Atribuído em {{date}}",
    dueOn: "Entrega em {{date}}",
    startCourse: "Iniciar curso",
    markCompleted: "Marcar como concluído"
  },
  content: {
    title: "Gestão de conteúdo",
    subtitle: "Crie e gerencie materiais de treinamento para sua equipe",
    heroBadge: "Central de aprendizagem",
    libraryTitle: "Biblioteca de cursos",
    courseCount: "{{count}} curso{{suffix}}",
    noCourses: "Ainda não há cursos. Crie o primeiro!",
    empty: "Ainda não há cursos. Crie o primeiro!",
    addCourse: "Adicionar novo curso",
    filters: {
      trainingType: "Tipo de treinamento",
      trainingTypes: {
        all: "Todos os tipos",
      },
    },
    filteredCount: "{{count}} curso{{suffix}} corresponde a este filtro"
  },
  courseForm: {
    titleLabel: "Título do curso *",
    descriptionLabel: "Descrição *",
    categoryLabel: "Categoria",
    difficultyLabel: "Dificuldade",
    durationLabel: "Duração (horas)",
    youtubeLabel: "Link do YouTube (opcional)",
    materialsLabel: "Materiais do curso (opcional)",
    previewButton: "Pré-visualizar documento",
    trainingTypeLabel: "Tipo de treinamento",
    categories: {
      technical: "Técnica",
      leadership: "Liderança",
      communication: "Comunicação",
      design: "Design",
      business: "Negócios"
    },
    difficulties: {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado"
    },
    trainingTypes: {
      sap: "SAP",
      sapHr: "SAP HR",
      sapHrPmo: "SAP HR PMO",
      webDevelopment: "Desenvolvimento Web",
      google: "Google",
    },
    ascendaIA: {
      title: "Gerador de quizzes AscendaIA",
<<<<<<< HEAD
      subtitle: "Gerador de Quizzes",
=======
>>>>>>> master
      description: "Crie questões inteligentes na página dedicada da AscendaIA.",
      action: "Abrir AscendaIA",
    }
  },
  courseCard: {
    label: "Curso em destaque",
    youtube: "YouTube",
    active: "{{count}} pessoa{{suffix}} ativa{{suffix}}",
    edit: "Editar",
    assign: "Atribuir",
    preview: "Pré-visualizar"
  },
  courseEdit: {
    title: "Editar curso",
    cancel: "Cancelar",
    save: "Salvar alterações"
  },
  assignModal: {
    title: "Atribuir \"{{course}}\" aos estagiários",
    selectInterns: "Selecione os estagiários *",
    noneAvailable: "Nenhum estagiário ativo disponível",
    selectedCount: "{{count}} estagiário{{suffix}} selecionado",
    dueDate: "Data limite (opcional)",
    notes: "Observações (opcional)",
    assigning: "Atribuindo...",
    assignTo: "Atribuir a {{count}} estagiário{{suffix}}",
    notificationTitle: "Novo curso atribuído",
    notificationBody: "\"{{course}}\" foi atribuído a {{name}}",
  },
  reports: {
    title: "Relatórios e análises",
    subtitle: "Insights sobre o desempenho e progresso da equipe",
    export: "Exportar relatório",
    teamPerformance: "Performance da equipe (Top 10)",
    teamPerformancePoints: {
      singular: "ponto",
      plural: "pontos",
    },
    taskDistribution: "Distribuição de tarefas",
    keyMetrics: "Resumo de métricas",
    totalInterns: "Total de estagiários",
    activeTasks: "Tarefas ativas",
    availableCourses: "Cursos disponíveis",
    avgPoints: "Pontuação média",
    noTaskData: "Nenhum dado de tarefas disponível",
    taskCompletion: {
      label: "{{status}}: {{percent}}",
      taskSingular: "tarefa",
      taskPlural: "tarefas",
    }
  },
  vacation: {
    title: "Solicitações de férias",
    subtitle: "Analise e gerencie os pedidos de férias dos estagiários",
    panelTitle: "Solicitações de férias",
    tabs: {
      list: "Lista de solicitações",
      calendar: "Visão em calendário"
    },
    filterPlaceholder: "Filtrar",
    none: "Nenhuma solicitação de férias encontrada",
    approve: "Aprovar",
    reject: "Rejeitar",
    rejectTitle: "Rejeitar solicitação de férias",
    rejectDescription: "Tem certeza de que deseja rejeitar esta solicitação? Você pode adicionar uma observação.",
    rejectConfirm: "Rejeitar solicitação",
    managerNoteOptional: "Nota do gestor (opcional)",
    labels: {
      from: "De:",
      to: "Até:",
      reason: "Motivo:",
      managerNote: "Nota do gestor:",
      requested: "Solicitado em {{date}}"
    },
    aria: {
      request: "Solicitação de férias de {{name}}",
      approve: "Aprovar solicitação de férias de {{name}}",
      reject: "Rejeitar solicitação de férias de {{name}}"
    },
    emoji: {
      title: "Atualizar emoji do perfil",
      description: "Escolha um emoji ou cole uma URL de imagem para {{name}}.",
      preview: "Pré-visualização",
      cancel: "Cancelar"
    },
    conflictLegend: {
      approved: "Aprovado",
      pending: "Pendente",
      conflict: "Conflito"
    },
    calendar: {
      months: {
        conflict: "{{count}} conflito{{suffix}} de agenda detectado"
      },
      approved: "Aprovado",
      pending: "Pendente",
      conflict: "Conflito",
      buttonToday: "Hoje",
      previousMonth: "Mês anterior",
      nextMonth: "Próximo mês",
      more: "...e mais {{count}}",
      conflictDetail: "{{name}} tem a tarefa \"{{task}}\" com prazo em {{date}} durante as férias"
    }
  },
  notifications: {
    title: "Notificações",
    markAllRead: "Marcar tudo como lido",
    today: "Hoje",
    thisWeek: "Esta semana",
    earlier: "Anterior",
    none: "Nenhuma notificação ainda",
    by: "Por {{name}}"
  },
  youtube: {
    invalid: "URL do YouTube inválida. Verifique o link.",
    detected: "Vídeo do YouTube identificado",
    thumbnailAlt: "Miniatura do vídeo",
    playOverlay: "Pré-visualização do vídeo do YouTube"
  },
  chat: {
    title: "Conversa",
    empty: "Ainda não há mensagens. Comece a conversa!",
    placeholder: "Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
  }
};

export default pt;
