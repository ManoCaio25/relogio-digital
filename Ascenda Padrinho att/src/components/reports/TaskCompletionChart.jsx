import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useLanguage, useTranslation } from "@/i18n";

const COLORS = {
  completed: 'var(--success)',
  in_progress: 'var(--brand)',
  pending: 'var(--warning)',
  overdue: 'var(--error)'
};

export default function TaskCompletionChart({ data }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const percentFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(language === "pt" ? "pt-BR" : "en-US", {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [language]
  );

  const taskCountFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(language === "pt" ? "pt-BR" : "en-US", {
        maximumFractionDigits: 0,
      }),
    [language]
  );
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted">
        <p>{t("reports.noTaskData")}</p>
      </div>
    );
  }

  const statusLabels = {
    completed: t("common.status.completed"),
    in_progress: t("common.status.inProgress"),
    pending: t("common.status.pending"),
    overdue: t("common.status.overdue"),
  };
  const getTaskLabel = React.useCallback(
    (value) =>
      t(
        value === 1
          ? "reports.taskCompletion.taskSingular"
          : "reports.taskCompletion.taskPlural"
      ),
    [t]
  );

  const formattedData = data.map((item) => ({
    ...item,
    displayName: statusLabels[item.name] || item.name,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ displayName, percent }) =>
            t("reports.taskCompletion.label", {
              status: displayName,
              percent: percentFormatter.format(percent),
            })
          }
          outerRadius={100}
          fill="var(--brand)"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
          }}
          formatter={(value, name, entry) => [
            `${taskCountFormatter.format(value)} ${getTaskLabel(value)}`,
            statusLabels[entry.payload.name] || entry.payload.displayName,
          ]}
        />
        <Legend
          wrapperStyle={{ color: "var(--text-secondary)" }}
          formatter={(value, entry) => entry.payload.displayName}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}