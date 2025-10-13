import { MOCK_GENERATED_QUIZZES } from '../mocks/quizzes.mock';

const simulateDelay = (result, delay = 240) =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

export const QuizService = {
  async listGenerated() {
    return simulateDelay(MOCK_GENERATED_QUIZZES);
  },
  async assign(assignments) {
    return simulateDelay({ success: true, assignments }, 200);
  },
};
