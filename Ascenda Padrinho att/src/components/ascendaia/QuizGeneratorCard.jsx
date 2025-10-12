import React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { quizSchema, defaultQuizValues } from "@/schemas/quiz";
import { quizService } from "@/services/quiz";
import { cn } from "@/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import QuizPreview from "./QuizPreview";

const difficultyOptions = [
  { label: "Iniciante", value: "easy" },
  { label: "Intermediário", value: "medium" },
  { label: "Avançado", value: "hard" },
];

const amountOptions = [5, 10, 15, 20];

export default function QuizGeneratorCard({ courseId, onSaved }) {
  const resolvedCourseId = courseId ?? "default-course";
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: defaultQuizValues,
    mode: "onChange",
  });

  const { control, handleSubmit, formState } = form;

  const onGenerate = handleSubmit(async (values) => {
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const result = await quizService.generate(values);
      setPreview({
        ...result,
        topic: values.topic.trim(),
        difficulty: values.difficulty,
        amount: values.amount,
      });
    } catch (error) {
      console.error("quizService.generate failed", error);
      setErrorMessage("Não foi possível gerar o quiz. Tente novamente.");
    } finally {
      setLoading(false);
    }
  });

  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await quizService.save({
        courseId: resolvedCourseId,
        quizId: preview.quizId,
        items: preview.items,
      });
      setStatusMessage("Quiz salvo com sucesso!");
      onSaved?.(preview.quizId);
    } catch (error) {
      console.error("quizService.save failed", error);
      setErrorMessage("Não foi possível salvar o quiz agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setPreview(null);
    setStatusMessage("Pré-visualização descartada.");
  };

  return (
    <Card className="rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm">
      <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-brand"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>
          <div>
            <h2 className="text-xl font-semibold text-white">AscendaIA — Gerar Quizzes</h2>
            <p className="text-sm text-white/70">
              Informe o tema e gere perguntas fictícias para validar seu curso antes da publicação.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={onGenerate} noValidate>
          {errorMessage && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-400/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
            >
              {errorMessage}
            </div>
          )}

          {statusMessage && !errorMessage && (
            <div
              role="status"
              className="rounded-2xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
            >
              {statusMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FormField
              control={control}
              name="topic"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel htmlFor="quiz-topic">Tópico ou link do YouTube</FormLabel>
                  <FormControl>
                    <Input
                      id="quiz-topic"
                      placeholder="Ex.: Fundamentos de gestão de projetos"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage name="topic" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="quiz-difficulty">Nível</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="quiz-difficulty" aria-label="Selecionar dificuldade">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage name="difficulty" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="quiz-amount">Quantidade</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="quiz-amount" aria-label="Selecionar quantidade">
                        <SelectValue placeholder="Selecione a quantidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {option} questões
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage name="amount" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              disabled={!formState.isValid || loading}
              className={cn(
                "h-12 rounded-2xl bg-brand px-6 text-sm font-semibold text-white transition",
                loading && "cursor-progress",
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </span>
              ) : (
                "Gerar Quiz com IA"
              )}
            </Button>

            {preview && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDiscard}
                  className="h-12 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Descartar
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={cn(
                    "h-12 rounded-2xl bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-400",
                    saving && "cursor-progress",
                  )}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    "Salvar Quiz"
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>

      <QuizPreview quiz={preview} key={preview ? preview.quizId : "empty"} />
    </Card>
  );
}
