import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage, useTranslation } from "@/i18n";

export default function PerformanceChart({ data }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const percentFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(language === "pt" ? "pt-BR" : "en-US", {
        maximumFractionDigits: 0,
      }),
    [language]
  );

  const tooltipValue = React.useCallback(
    (value) =>
      t(
        "dashboard.performanceChart.tooltipValue",
        '{{value}}% score',
        {
          value: percentFormatter.format(value),
        },
      ),
    [percentFormatter, t]
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted">
        <p>{t("dashboard.performanceChart.noData")}</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
        <XAxis
          dataKey="month"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)" }}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)" }}
          style={{ fontSize: "12px" }}
          domain={[0, 100]}
          tickFormatter={(value) =>
            t(
              "dashboard.performanceChart.percentValue",
              '{{value}}%',
              {
                value: percentFormatter.format(value),
              },
            )
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
          }}
          labelStyle={{ color: "var(--text-secondary)" }}
          formatter={(value) => [
            tooltipValue(value),
            t("dashboard.performanceChart.legendLabel"),
          ]}
          labelFormatter={(label) =>
            t(
              "dashboard.performanceChart.tooltipLabel",
              'Month: {{label}}',
              { label },
            )
          }
        />
        <Legend
          wrapperStyle={{ color: "var(--text-secondary)" }}
          iconType="line"
          formatter={() => t("dashboard.performanceChart.legendLabel")}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--brand)"
          strokeWidth={2}
          fill="url(#colorScore)"
          name={t("dashboard.performanceChart.legendLabel")}
          dot={{ fill: "var(--brand)", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}