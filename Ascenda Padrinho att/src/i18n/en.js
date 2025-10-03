const en = {
  common: {
    cancel: 'Cancel',
    save: 'Save',
  },
  language: {
    english: 'English',
    portuguese: 'Português',
  },
  layout: {
    appName: 'Ascenda',
    subtitle: 'Manager Portal',
    navigation: 'Navigation',
    logout: 'Logout',
    navItems: {
      dashboard: 'Dashboard',
      interns: 'Team Overview',
      content: 'Content Management',
      vacation: 'Vacation Requests',
      reports: 'Reports',
    },
    userFallback: 'Manager',
  },
  dashboard: {
    title: 'Welcome back, {{name}}!',
    subtitle: "Here's what's happening with your team today",
    cards: {
      interns: {
        title: 'Total Interns',
        trend: '+2 this month',
      },
      courses: {
        title: 'Courses Available',
      },
      reviews: {
        title: 'Pending Reviews',
      },
      points: {
        title: 'Team Points',
        trend: '+15%'
      },
    },
    status: {
      heading: 'Intern Status & Well-being',
      count: '{{count}} interns',
      progressLabel: 'Internship Progress',
      daysLeft: '{{count}} days left',
      systemStatus: 'System Status',
      active: 'Active',
      paused: 'Paused',
    },
    notifications: {
      pausedTitle: 'Intern Paused',
      resumedTitle: 'Intern Resumed',
      pausedBody: 'Learning system paused for {{name}}',
      resumedBody: 'Learning system resumed for {{name}}',
    },
  },
  interns: {
    title: 'Team Overview',
    subtitle: "Manage and track your team's progress",
    searchPlaceholder: 'Search interns...',
    levelPlaceholder: 'Level',
    statusPlaceholder: 'Status',
    filters: {
      allLevels: 'All Levels',
      novice: 'Novice',
      apprentice: 'Apprentice',
      journeyman: 'Journeyman',
      expert: 'Expert',
      master: 'Master',
      allStatus: 'All Status',
      active: 'Active',
      paused: 'Paused',
      completed: 'Completed',
    },
    empty: 'No interns found matching your filters',
    card: {
      points: 'Points',
      avgScore: '{{value}}% avg',
      daysLeft: '{{count}}d left',
      chat: 'Chat',
      trackFallback: 'Learning Track',
      progressTitle: 'Well-being: {{status}}',
    },
  },
  content: {
    title: 'Content Management',
    subtitle: 'Create and manage training materials for your team',
    libraryTitle: 'Course Library',
    courseCount: '{{count}} courses',
    empty: 'No courses yet. Create your first one!',
  },
  vacations: {
    title: 'Vacation Requests',
    subtitle: 'Review and manage intern vacation requests',
    panel: {
      heading: 'Vacation Requests',
      tabs: {
        list: 'Requests List',
        calendar: 'Calendar View',
      },
      filterPlaceholder: 'Filter',
      filters: {
        all: 'All Requests',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      count: {
        one: '1 request',
        other: '{{count}} requests',
      },
      aria: {
        listItem: 'Vacation request from {{name}}',
        updateEmoji: 'Update profile emoji for {{name}}',
        approve: 'Approve vacation request for {{name}}',
        reject: 'Reject vacation request for {{name}}',
      },
      fields: {
        from: 'From',
        to: 'To',
        reason: 'Reason',
        managerNote: 'Manager note:',
        requestedOn: 'Requested {{date}}',
        trackFallback: 'Learning track',
      },
      actions: {
        approve: 'Approve',
        reject: 'Reject',
        saveEmoji: 'Save Emoji',
        rejectRequest: 'Reject Request',
      },
      empty: 'No vacation requests found',
      emojiDialog: {
        title: 'Update Profile Emoji',
        description: 'Choose an emoji or paste an image URL for {{name}}.',
        placeholder: 'Try 😀 or paste an image URL',
        helper: 'Emojis render beautifully across the app and you can swap them anytime. Image URLs are also supported.',
        previewLabel: 'Preview',
      },
      rejectDialog: {
        title: 'Reject Vacation Request',
        description: 'Are you sure you want to reject this vacation request? You can optionally add a note.',
        noteLabel: 'Manager Note (Optional)',
        notePlaceholder: 'Explain the reason for rejection...',
      },
      notifications: {
        approvedTitle: 'Vacation Request Approved',
        approvedBody: 'Your vacation request from {{start}} to {{end}} has been approved.',
        rejectedTitle: 'Vacation Request Rejected',
        rejectedBody: 'Your vacation request from {{start}} to {{end}} has been rejected.',
        noteSuffix: ' Note: {{note}}',
      },
    },
  },
  reports: {
    title: 'Reports & Analytics',
    subtitle: "Insights into your team's performance and progress",
    export: 'Export Report',
    charts: {
      teamPerformance: 'Team Performance (Top 10)',
      taskDistribution: 'Task Distribution',
      statuses: {
        completed: 'Completed',
        in_progress: 'In Progress',
        pending: 'Pending',
        overdue: 'Overdue',
        empty: 'No task data available',
      },
      performanceEmpty: 'No performance data available',
      legendPoints: 'Points',
    },
    metrics: {
      title: 'Key Metrics Summary',
      totalInterns: 'Total Interns',
      activeTasks: 'Active Tasks',
      availableCourses: 'Available Courses',
      avgPoints: 'Avg. Points',
    },
  },
};

export default en;
