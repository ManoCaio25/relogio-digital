import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown, Annoyed, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Avatar from "../ui/Avatar";
import { getDaysLeft, getDaysLeftBadgeColor, getInternshipProgress } from "../utils/dates";
import { getLevelLabel, getTrackLabel } from "@/utils/labels";
import { useTranslation } from "../../i18n";

const wellBeingVariants = {
  "Excellent": { icon: Smile, color: "text-success", bg: "bg-success/10" },
  "Good": { icon: Smile, color: "text-blue-500", bg: "bg-blue-500/10" },
  "Neutral": { icon: Meh, color: "text-warning", bg: "bg-warning/10" },
  "Stressed": { icon: Frown, color: "text-orange-500", bg: "bg-orange-500/10" },
  "Overwhelmed": { icon: Annoyed, color: "text-error", bg: "bg-error/10" }
};

const wellBeingAliases = {
  "excellent": "Excellent",
  "good": "Good",
  "neutral": "Neutral",
  "stressed": "Stressed",
  "overwhelmed": "Overwhelmed",
  "green": "Excellent",
  "yellow": "Neutral",
  "red": "Overwhelmed"
};

export default function InternStatusCard({ intern, onStatusToggle, index }) {
  const { t } = useTranslation();
  const rawStatus = intern.well_being_status;
  const normalizedStatus = typeof rawStatus === "string"
    ? rawStatus.trim().toLowerCase()
    : undefined;
  const canonicalStatus = normalizedStatus && wellBeingAliases[normalizedStatus]
    ? wellBeingAliases[normalizedStatus]
    : rawStatus;

  const wellBeing = wellBeingVariants[canonicalStatus] || wellBeingVariants["Neutral"];
  const WellBeingIcon = wellBeing.icon;
  const isActive = intern.status === 'active';
  
  const daysLeft = intern.end_date ? getDaysLeft(intern.end_date) : null;
  const daysLeftColors = daysLeft !== null ? getDaysLeftBadgeColor(daysLeft) : null;
  const progress = intern.start_date && intern.end_date 
    ? getInternshipProgress(intern.start_date, intern.end_date) 
    : 0;

  const radialData = React.useMemo(() => [{
    name: 'Progress',
    value: progress,
    fill: progress > 66 ? 'var(--error)' : progress > 33 ? 'var(--warning)' : 'var(--success)'
  }], [progress]);

  const trackLabel = React.useMemo(
    () =>
      getTrackLabel(
        intern.track,
        t,
        t('internStatus.trackFallback', 'Learning Track')
      ),
    [intern.track, t]
  );

  const levelLabel = React.useMemo(
    () => getLevelLabel(intern.level, t, intern.level || ''),
    [intern.level, t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-border bg-surface hover:shadow-e2 transition-all duration-350 shadow-e1">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand2 p-0.5">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                  <Avatar 
                    src={intern.avatar_url} 
                    alt={intern.full_name}
                    size={60}
                  />
                </div>
              </div>
              {!isActive && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center border-2 border-surface">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-primary text-lg truncate">
                    {intern.full_name}
                  </h3>
                  {intern.well_being_status && (
                    <div
                      className={`p-1.5 rounded-lg ${wellBeing.bg}`}
                      title={t('interns.card.progressTitle', 'Well-being: {{status}}', {
                        status: canonicalStatus || intern.well_being_status || 'Unknown',
                      })}
                    >
                      <WellBeingIcon className={`w-4 h-4 ${wellBeing.color}`} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <Badge variant="outline" className="bg-surface2 text-secondary border-border">
                    {trackLabel}
                  </Badge>
                  <span className="text-muted">•</span>
                  <span className="text-muted">{levelLabel}</span>
                </div>
              </div>

              {daysLeft !== null && daysLeftColors && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        data={radialData} 
                        startAngle={90} 
                        endAngle={-270}
                        innerRadius="70%"
                        outerRadius="100%"
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted mb-1">
                      {t('dashboard.status.progressLabel', 'Internship Progress')}
                    </p>
                    <Badge className={`${daysLeftColors.bg} ${daysLeftColors.text} border ${daysLeftColors.border}`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {t('dashboard.status.daysLeft', '{{count}} days left', { count: daysLeft })}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Label htmlFor={`status-${intern.id}`} className="text-sm text-secondary cursor-pointer">
                  {t('dashboard.status.systemStatus', 'System Status')}
                </Label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isActive ? 'text-success' : 'text-warning'}`}>
                    {isActive
                      ? t('dashboard.status.active', 'Active')
                      : t('dashboard.status.paused', 'Paused')}
                  </span>
                  <Switch
                    id={`status-${intern.id}`}
                    checked={isActive}
                    onCheckedChange={() => onStatusToggle(intern)}
                    className="data-[state=checked]:bg-success"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}