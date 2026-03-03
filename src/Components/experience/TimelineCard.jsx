import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { useTranslation } from "react-i18next";

export default function TimelineCard({
  title,
  subtitle,
  location,
  dateRange,
  description,
  bullets = [],
  isLast = false
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const toggle = () => setExpanded((v) => !v);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[15px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-teal-400/40 to-cyan-100/40 dark:from-cyan-400 dark:via-teal-400/20 dark:to-slate-800" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[3px] border-cyan-500 shadow-lg shadow-cyan-500/15" />

      {/* Card */}
      <div
        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-200/60 dark:hover:border-cyan-400/20 transition-all duration-300 p-5 md:p-6 mb-6 md:mb-8 cursor-pointer"
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${title} ${t('common.at', { defaultValue: 'at' })} ${subtitle}`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
              {title}
            </h3>
            <p className="text-cyan-700 dark:text-cyan-300 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
            {dateRange && (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5" />
                {dateRange}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {description}
          </p>
        )}

        {bullets.length > 0 && (
          <motion.div
            initial={false}
            animate={{ height: expanded ? "auto" : "0" }}
            className="overflow-hidden"
          >
            <ul
              className="space-y-2 pt-3 border-t border-slate-200/70 dark:border-slate-800"
              role="list"
            >
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {bullets.length > 0 && (
          <div className="flex items-center justify-center mt-3 pt-2">
            <Badge
              variant="secondary"
              className="bg-slate-50 hover:bg-cyan-50 text-slate-500 hover:text-cyan-700 dark:bg-slate-800 dark:hover:bg-cyan-500/10 dark:text-slate-300 dark:hover:text-cyan-200 transition-colors cursor-pointer"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 mr-1" />
                  {t('timeline.showLess', { defaultValue: 'Show less' })}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 mr-1" />
                  {t('timeline.showAchievements', { defaultValue: 'Show achievements' })}
                </>
              )}
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}
