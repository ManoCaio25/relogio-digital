export const users = [
  {
    id: 1,
    full_name: 'Marina Costa',
    email: 'marina.costa@ascenda.com',
    role: 'Manager'
  }
];

export const interns = [
  {
    id: 1,
    full_name: 'Lucas Almeida',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas-almeida',
    email: 'lucas.almeida@ascenda.com',
    level: 'Journeyman',
    status: 'active',
    track: 'Front-end Engineering',
    cohort: '2024.1',
    mentor_name: 'Ana Ribeiro',
    points: 820,
    well_being_status: 'green',
    start_date: '2024-02-01T00:00:00.000Z',
    end_date: '2024-11-30T00:00:00.000Z',
    skills: ['React', 'TypeScript', 'UX'],
    performance_history: [
      { date: '2024-03-01', score: 72 },
      { date: '2024-04-01', score: 78 },
      { date: '2024-05-01', score: 82 },
      { date: '2024-06-01', score: 85 },
      { date: '2024-07-01', score: 88 },
      { date: '2024-08-01', score: 90 }
    ]
  },
  {
    id: 2,
    full_name: 'Carla Mendes',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carla-mendes',
    email: 'carla.mendes@ascenda.com',
    level: 'Apprentice',
    status: 'active',
    track: 'Data Analytics',
    cohort: '2024.1',
    mentor_name: 'João Freitas',
    points: 640,
    well_being_status: 'yellow',
    start_date: '2024-01-15T00:00:00.000Z',
    end_date: '2024-10-15T00:00:00.000Z',
    skills: ['SQL', 'Python', 'Storytelling'],
    performance_history: [
      { date: '2024-03-01', score: 65 },
      { date: '2024-04-01', score: 68 },
      { date: '2024-05-01', score: 70 },
      { date: '2024-06-01', score: 74 },
      { date: '2024-07-01', score: 76 },
      { date: '2024-08-01', score: 79 }
    ]
  },
  {
    id: 3,
    full_name: 'Pedro Silva',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro-silva',
    email: 'pedro.silva@ascenda.com',
    level: 'Expert',
    status: 'active',
    track: 'Product Design',
    cohort: '2023.2',
    mentor_name: 'Helena Prado',
    points: 950,
    well_being_status: 'green',
    start_date: '2023-11-01T00:00:00.000Z',
    end_date: '2024-09-15T00:00:00.000Z',
    skills: ['Figma', 'Design Systems', 'User Research'],
    performance_history: [
      { date: '2024-03-01', score: 85 },
      { date: '2024-04-01', score: 87 },
      { date: '2024-05-01', score: 90 },
      { date: '2024-06-01', score: 92 },
      { date: '2024-07-01', score: 94 },
      { date: '2024-08-01', score: 95 }
    ]
  },
  {
    id: 4,
    full_name: 'Ana Bezerra',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana-bezerra',
    email: 'ana.bezerra@ascenda.com',
    level: 'Novice',
    status: 'paused',
    track: 'Customer Success',
    cohort: '2024.2',
    mentor_name: 'Rodrigo Serra',
    points: 410,
    well_being_status: 'red',
    start_date: '2024-04-10T00:00:00.000Z',
    end_date: '2025-01-15T00:00:00.000Z',
    skills: ['Support', 'Empathy', 'Communication'],
    performance_history: [
      { date: '2024-05-01', score: 52 },
      { date: '2024-06-01', score: 55 },
      { date: '2024-07-01', score: 58 },
      { date: '2024-08-01', score: 60 }
    ]
  }
];

export const courses = [
  {
    id: 1,
    title: 'React Performance Masterclass',
    description: 'Learn advanced patterns and profiling strategies to deliver snappy React applications.',
    category: 'Technical',
    difficulty: 'Advanced',
    duration_hours: 6,
    created_date: '2024-05-20T10:00:00.000Z',
    enrolled_count: 42,
    completion_rate: 68,
    published: true,
    youtube_url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
    youtube_video_id: 'dpw9EHDh2bM'
  },
  {
    id: 2,
    title: 'Data Storytelling Fundamentals',
    description: 'Transform complex analysis into compelling narratives that influence stakeholders.',
    category: 'Communication',
    difficulty: 'Intermediate',
    duration_hours: 4,
    created_date: '2024-04-12T09:00:00.000Z',
    enrolled_count: 36,
    completion_rate: 74,
    published: true,
    file_url: '/docs/data-storytelling.pdf',
    file_name: 'data-storytelling.pdf'
  },
  {
    id: 3,
    title: 'Empathy Driven Customer Success',
    description: 'Build long lasting relationships by combining active listening with proactive engagement.',
    category: 'Leadership',
    difficulty: 'Beginner',
    duration_hours: 3,
    created_date: '2024-03-18T14:00:00.000Z',
    enrolled_count: 28,
    completion_rate: 61,
    published: true
  }
];

export const courseAssignments = [
  {
    id: 1,
    intern_id: 1,
    course_id: 1,
    status: 'in_progress',
    progress: 55,
    assigned_by: 'marina.costa@ascenda.com',
    assigned_date: '2024-07-01T08:00:00.000Z',
    due_date: '2024-09-01T00:00:00.000Z',
    notes: 'Focus on the memoization section first.'
  },
  {
    id: 2,
    intern_id: 2,
    course_id: 2,
    status: 'assigned',
    progress: 0,
    assigned_by: 'marina.costa@ascenda.com',
    assigned_date: '2024-08-10T10:00:00.000Z',
    due_date: '2024-09-30T00:00:00.000Z'
  },
  {
    id: 3,
    intern_id: 3,
    course_id: 1,
    status: 'completed',
    progress: 100,
    assigned_by: 'marina.costa@ascenda.com',
    assigned_date: '2024-04-02T10:00:00.000Z',
    started_date: '2024-04-05T10:00:00.000Z',
    completed_date: '2024-05-15T10:00:00.000Z'
  }
];

export const tasks = [
  {
    id: 1,
    intern_id: 1,
    title: 'Ship performance audit',
    status: 'completed',
    due_date: '2024-07-15T00:00:00.000Z'
  },
  {
    id: 2,
    intern_id: 1,
    title: 'Refine onboarding flows',
    status: 'in_progress',
    due_date: '2024-09-01T00:00:00.000Z'
  },
  {
    id: 3,
    intern_id: 2,
    title: 'Customer feedback analysis',
    status: 'pending',
    due_date: '2024-08-28T00:00:00.000Z'
  },
  {
    id: 4,
    intern_id: 3,
    title: 'Design system accessibility review',
    status: 'completed',
    due_date: '2024-06-30T00:00:00.000Z'
  },
  {
    id: 5,
    intern_id: 4,
    title: 'CS playbook iteration',
    status: 'pending',
    due_date: '2024-09-10T00:00:00.000Z'
  }
];

export const notifications = [
  {
    id: 1,
    type: 'course_assigned',
    title: 'New Course Assigned',
    body: 'Lucas Almeida received "React Performance Masterclass".',
    target_id: 1,
    target_kind: 'course',
    actor_name: 'Marina Costa',
    created_date: '2024-08-12T12:20:00.000Z',
    read: false
  },
  {
    id: 2,
    type: 'vacation_status_changed',
    title: 'Vacation Request Approved',
    body: 'Pedro Silva will be on vacation from Aug 21 to Aug 25.',
    target_id: 2,
    target_kind: 'request',
    actor_name: 'Marina Costa',
    created_date: '2024-08-10T09:00:00.000Z',
    read: true
  },
  {
    id: 3,
    type: 'intern_paused',
    title: 'Intern paused',
    body: 'Ana Bezerra learning journey paused by mentor.',
    target_id: 4,
    target_kind: 'intern',
    actor_name: 'Ana Ribeiro',
    created_date: '2024-07-22T14:30:00.000Z',
    read: false
  }
];

export const vacationRequests = [
  {
    id: 1,
    intern_id: 3,
    status: 'approved',
    start_date: '2024-08-21T00:00:00.000Z',
    end_date: '2024-08-25T00:00:00.000Z',
    created_date: '2024-07-15T09:30:00.000Z',
    decided_at: '2024-07-20T10:00:00.000Z',
    manager_note: 'Enjoy a well deserved break!'
  },
  {
    id: 2,
    intern_id: 2,
    status: 'pending',
    start_date: '2024-09-10T00:00:00.000Z',
    end_date: '2024-09-12T00:00:00.000Z',
    created_date: '2024-08-05T11:00:00.000Z',
    reason: 'Family trip to visit grandparents.'
  },
  {
    id: 3,
    intern_id: 4,
    status: 'rejected',
    start_date: '2024-08-15T00:00:00.000Z',
    end_date: '2024-08-16T00:00:00.000Z',
    created_date: '2024-07-28T13:00:00.000Z',
    decided_at: '2024-07-30T09:00:00.000Z',
    manager_note: 'Need you during the onboarding sprint.'
  }
];

export const chatMessages = [
  {
    id: 1,
    intern_id: 1,
    from: 'intern',
    text: 'Oi! Você poderia revisar o meu último pull request? 😊',
    created_date: '2024-08-14T13:12:00.000Z',
    read: false
  },
  {
    id: 2,
    intern_id: 1,
    from: 'manager',
    text: 'Claro! Vou olhar ainda hoje e te aviso.',
    created_date: '2024-08-14T13:18:00.000Z',
    read: true
  },
  {
    id: 3,
    intern_id: 2,
    from: 'intern',
    text: 'Terminei o estudo de caso. Podemos conversar amanhã?',
    created_date: '2024-08-13T09:45:00.000Z',
    read: true
  }
];

