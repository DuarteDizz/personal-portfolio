import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { useTranslation } from "react-i18next";

export default function EducationCard({
  degree,
  fieldOfStudy,
  institution,
  location,
  graduationYear,
  gpa,
  honors = [],
  index = 0
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
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-200/60 dark:hover:border-cyan-400/20 transition-all duration-300 p-5 md:p-6 cursor-pointer"
      onClick={toggle}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${degree} ${t('common.at', { defaultValue: 'at' })} ${institution}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                {degree}
              </h3>

              {fieldOfStudy && (
                <p className="text-cyan-700 dark:text-cyan-300 font-medium">
                  {fieldOfStudy}
                </p>
              )}

              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                {institution}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}

              {graduationYear && (
                <Badge
                  variant="outline"
                  className="border-cyan-200/80 dark:border-cyan-400/20 text-cyan-800 dark:text-cyan-200 bg-white/60 dark:bg-slate-900"
                >
                  {graduationYear}
                </Badge>
              )}

              {gpa && (
                <Badge className="bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-200 dark:hover:bg-cyan-500/15">
                  {t('education.gpaLabel', { defaultValue: 'GPA:' })} {gpa}
                </Badge>
              )}
            </div>
          </div>

          {honors.length > 0 && (
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : "0" }}
              className="overflow-hidden"
            >
              <ul
                className="space-y-2 pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800"
                role="list"
              >
                {honors.map((honor, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <Award className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{honor}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {honors.length > 0 && (
            <div className="flex items-center mt-3 pt-2">
              <Badge
                variant="secondary"
                className="bg-slate-50 hover:bg-cyan-50 text-slate-500 hover:text-cyan-700 dark:bg-slate-800 dark:hover:bg-cyan-500/10 dark:text-slate-300 dark:hover:text-cyan-200 transition-colors cursor-pointer"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 mr-1" />
                    {t('education.showLess', { defaultValue: 'Show less' })}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 mr-1" />
                    {t('education.showDetails', { defaultValue: 'Show details' })}
                  </>
                )}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
