import { z } from "zod";

export const quizSchema = z.object({
  topic: z
    .string({ required_error: "Informe um tópico para gerar o quiz." })
    .min(3, "Digite pelo menos 3 caracteres."),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Selecione um nível de dificuldade.",
  }),
  amount: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)], {
    required_error: "Escolha a quantidade de questões.",
  }),
});

export const defaultQuizValues = {
  topic: "",
  difficulty: "easy",
  amount: 5,
};
