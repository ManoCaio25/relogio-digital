import React from "react";
import { FormProvider, Controller, useFormContext } from "react-hook-form";
import { cn } from "@/utils";

export function Form({ children, ...form }) {
  return <FormProvider {...form}>{children}</FormProvider>;
}

export function FormField({ name, control, render }) {
  return <Controller name={name} control={control} render={render} />;
}

export function FormItem({ className, ...props }) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }) {
  return (
    <label className={cn("text-sm font-medium text-white", className)} {...props} />
  );
}

export function FormControl({ className, ...props }) {
  return <div className={cn("w-full", className)} {...props} />;
}

export function FormDescription({ className, ...props }) {
  return (
    <p className={cn("text-xs text-white/60", className)} {...props} />
  );
}

export function FormMessage({ className, name }) {
  const {
    formState: { errors },
  } = useFormContext();

  const message = name && errors[name]?.message;
  if (!message) return null;

  return (
    <p role="alert" className={cn("text-xs text-error", className)}>
      {String(message)}
    </p>
  );
}
