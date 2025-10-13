import { create } from 'zustand';
import localforage from '@/lib/localforage';
import { nanoid } from 'nanoid';

const STORAGE_KEYS = {
  templates: 'afq:templates',
  assignments: 'afq:assignments',
  inboxIndex: 'afq:inbox:index',
  inboxFor: (userId) => `afq:inbox:${userId}`,
};

const storage = localforage.createInstance({ name: 'ascenda-ia' });

const debounceTimers = new Map();
const DEBOUNCE_MS = 300;

function schedulePersist(key, value) {
  const existing = debounceTimers.get(key);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(() => {
    storage.setItem(key, value).catch((error) => {
      console.error(`Failed to persist key "${key}"`, error);
    });
    debounceTimers.delete(key);
  }, DEBOUNCE_MS);

  debounceTimers.set(key, timer);
}

async function loadInboxFromStorage() {
  try {
    const index = (await storage.getItem(STORAGE_KEYS.inboxIndex)) ?? [];
    if (!Array.isArray(index) || !index.length) {
      return {};
    }

    const entries = await Promise.all(
      index.map(async (userId) => {
        const list = (await storage.getItem(STORAGE_KEYS.inboxFor(userId))) ?? [];
        return [userId, Array.isArray(list) ? list : []];
      }),
    );

    return Object.fromEntries(entries);
  } catch (error) {
    console.error('Failed to hydrate inbox from storage', error);
    return {};
  }
}

function ensureInboxIndex(inboxByUser) {
  const index = Object.keys(inboxByUser);
  schedulePersist(STORAGE_KEYS.inboxIndex, index);
}

function buildItemsFromGenerator(quiz, overridesItems) {
  if (Array.isArray(overridesItems) && overridesItems.length) {
    return overridesItems.map((item) => ({
      id: item.id ?? `qitm_${nanoid(8)}`,
      question: item.question ?? '',
      options: item.options ?? [],
      answer: item.answer ?? '',
    }));
  }

  if (!quiz) return [];

  const levels = ['easy', 'intermediate', 'advanced'];
  return levels
    .flatMap((level) => quiz?.[level] ?? [])
    .map((item) => ({
      id: item.id ?? `qitm_${nanoid(8)}`,
      question: item.prompt ?? '',
      options: item.options ?? [],
      answer:
        typeof item.correctIndex === 'number'
          ? item.options?.[item.correctIndex] ?? ''
          : item.answer ?? '',
      level: item.level ?? level,
    }));
}

function notifyMock(payload) {
  if (!payload) return;
  console.info('[AscendaIA][notify]', payload);
}

export const useQuizzesStore = create((set, get) => ({
  hydrated: false,
  templates: [],
  assignments: [],
  inboxByUser: {},
  generatedQuizzes: [],

  async hydrate() {
    if (get().hydrated) return;

    try {
      const [templates, assignments, inboxByUser] = await Promise.all([
        storage.getItem(STORAGE_KEYS.templates),
        storage.getItem(STORAGE_KEYS.assignments),
        loadInboxFromStorage(),
      ]);

      set({
        templates: Array.isArray(templates) ? templates : [],
        assignments: Array.isArray(assignments) ? assignments : [],
        inboxByUser,
        hydrated: true,
      });
    } catch (error) {
      console.error('Failed to hydrate quizzes store', error);
      set({ hydrated: true });
    }
  },

  setGeneratedQuizzes(quizzes) {
    set({ generatedQuizzes: Array.isArray(quizzes) ? quizzes : [] });
  },

  updateQuizMeta(id, patch) {
    if (!id) return;
    set(({ generatedQuizzes }) => ({
      generatedQuizzes: generatedQuizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...patch } : quiz,
      ),
    }));
  },

  addTemplateFromGenerator(payload, overrides = {}) {
    const baseQuiz = payload?.quiz ?? payload;
    const now = Date.now();

    const template = {
      id: overrides.id ?? `qtpl_${nanoid(10)}`,
      title: overrides.title ?? baseQuiz?.topic ?? 'Untitled Quiz',
      description: overrides.description ?? baseQuiz?.source ?? '',
      tags: Array.isArray(overrides.tags)
        ? overrides.tags
        : Array.isArray(baseQuiz?.tags)
          ? baseQuiz.tags
          : [],
      difficulty: overrides.difficulty ?? overrides.level ?? 'Medium',
      items: buildItemsFromGenerator(baseQuiz, overrides.items),
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now,
      version: overrides.version ?? 1,
      authorId: overrides.authorId ?? 'ascenda-ia',
      archived: Boolean(overrides.archived ?? false),
    };

    set((state) => {
      const templates = [...state.templates, template];
      schedulePersist(STORAGE_KEYS.templates, templates);
      return { templates };
    });

    notifyMock({
      title: 'Saved to Course Library',
      message: template.title,
      toUserId: overrides.authorId ?? 'ascenda-ia',
    });

    return template;
  },

  updateTemplate(id, patch) {
    if (!id) return null;

    let updatedTemplate = null;
    set((state) => {
      const templates = state.templates.map((template) => {
        if (template.id !== id) return template;

        const now = Date.now();
        updatedTemplate = {
          ...template,
          ...patch,
          items: patch.items ? buildItemsFromGenerator(null, patch.items) : template.items,
          version: template.version + 1,
          updatedAt: now,
        };
        return updatedTemplate;
      });

      if (updatedTemplate) {
        schedulePersist(STORAGE_KEYS.templates, templates);
      }

      return { templates };
    });

    return updatedTemplate;
  },

  duplicateTemplate(id) {
    const original = get().templates.find((template) => template.id === id);
    if (!original) return null;

    const now = Date.now();
    const duplicate = {
      ...original,
      id: `qtpl_${nanoid(10)}`,
      title: `Copy of ${original.title}`,
      version: 1,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };

    set((state) => {
      const templates = [...state.templates, duplicate];
      schedulePersist(STORAGE_KEYS.templates, templates);
      return { templates };
    });

    return duplicate;
  },

  archiveTemplate(id, flag = true) {
    if (!id) return null;

    let archivedTemplate = null;
    set((state) => {
      const templates = state.templates.map((template) => {
        if (template.id !== id) return template;
        const updated = {
          ...template,
          archived: Boolean(flag),
          updatedAt: Date.now(),
        };
        archivedTemplate = updated;
        return updated;
      });

      if (archivedTemplate) {
        schedulePersist(STORAGE_KEYS.templates, templates);
      }

      return { templates };
    });

    return archivedTemplate;
  },

  assignFromTemplate(templateId, payload) {
    const template = get().templates.find((item) => item.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const assignees = Array.from(new Set(payload?.assignees ?? [])).filter(Boolean);
    if (!assignees.length) {
      throw new Error('No assignees provided');
    }

    const now = Date.now();
    const assignment = {
      id: `asgn_${nanoid(10)}`,
      templateId,
      assignees,
      dueDate: payload?.dueDate ?? null,
      visibility: payload?.visibility ?? 'Private',
      status: 'assigned',
      createdAt: now,
    };

    const quizInstanceBase = {
      templateId,
      templateVersion: template.version,
      title: template.title,
      difficulty: template.difficulty,
      items: template.items,
      status: 'pending',
      assignedAt: now,
      dueDate: payload?.dueDate ?? null,
      visibility: payload?.visibility ?? 'Private',
      assignmentId: assignment.id,
    };

    const inboxUpdates = {};

    set((state) => {
      const assignments = [...state.assignments, assignment];
      schedulePersist(STORAGE_KEYS.assignments, assignments);

      const inboxByUser = { ...state.inboxByUser };

      assignees.forEach((userId) => {
        const quizInstance = {
          ...quizInstanceBase,
          id: `quiz_${nanoid(10)}`,
          assigneeId: userId,
        };

        const inbox = Array.isArray(inboxByUser[userId])
          ? [...inboxByUser[userId], quizInstance]
          : [quizInstance];

        inboxByUser[userId] = inbox;
        inboxUpdates[userId] = inbox;
      });

      Object.entries(inboxUpdates).forEach(([userId, inbox]) => {
        schedulePersist(STORAGE_KEYS.inboxFor(userId), inbox);
      });
      ensureInboxIndex(inboxByUser);

      assignees.forEach((userId) => {
        notifyMock({
          toUserId: userId,
          title: 'Assigned to you',
          message: template.title,
        });
      });

      return { assignments, inboxByUser };
    });

    return assignment;
  },

  pushToInbox(userId, quiz) {
    if (!userId || !quiz) return null;

    let storedQuiz = null;
    set((state) => {
      const inboxByUser = { ...state.inboxByUser };
      const list = Array.isArray(inboxByUser[userId]) ? [...inboxByUser[userId]] : [];

      storedQuiz = {
        ...quiz,
        id: quiz.id ?? `quiz_${nanoid(10)}`,
      };

      list.push(storedQuiz);
      inboxByUser[userId] = list;

      schedulePersist(STORAGE_KEYS.inboxFor(userId), list);
      ensureInboxIndex(inboxByUser);

      return { inboxByUser };
    });

    return storedQuiz;
  },

  markQuizDone(userId, quizId) {
    if (!userId || !quizId) return null;

    let updatedQuiz = null;
    set((state) => {
      const inboxByUser = { ...state.inboxByUser };
      const list = Array.isArray(inboxByUser[userId]) ? [...inboxByUser[userId]] : [];

      const updatedList = list.map((quiz) => {
        if (quiz.id !== quizId) return quiz;
        updatedQuiz = {
          ...quiz,
          status: 'done',
          completedAt: Date.now(),
        };
        return updatedQuiz;
      });

      inboxByUser[userId] = updatedList;
      schedulePersist(STORAGE_KEYS.inboxFor(userId), updatedList);
      ensureInboxIndex(inboxByUser);

      if (updatedQuiz?.assignmentId) {
        notifyMock({
          toUserId: updatedQuiz.assignmentId,
          title: 'Quiz completed',
          message: updatedQuiz.title,
        });
      }

      return { inboxByUser };
    });

    return updatedQuiz;
  },
}));

