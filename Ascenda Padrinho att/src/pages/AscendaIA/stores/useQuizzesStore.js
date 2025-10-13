import { create } from 'zustand';

export const useQuizzesStore = create((set, get) => ({
  generatedQuizzes: [],
  assignments: [],
  setGeneratedQuizzes: (quizzes) => set({ generatedQuizzes: quizzes }),
  updateQuizMeta: (id, patch) =>
    set({
      generatedQuizzes: get().generatedQuizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...patch } : quiz,
      ),
    }),
  assignQuizzes: (quizIds, payload) => {
    const now = Date.now();
    const newAssignments = quizIds.map((quizId, index) => ({
      id: `asgn_${now}_${index}`,
      quizId,
      ...payload,
      status: 'assigned',
    }));
    set({ assignments: [...get().assignments, ...newAssignments] });
    return newAssignments;
  },
  selectAssignmentsByUser: (login) =>
    get().assignments.filter((assignment) => assignment.assignees?.includes(login)),
}));
