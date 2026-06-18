import React from "react";
import { Award, Briefcase, ChevronRight, HelpCircle } from "lucide-react";

interface HeaderProps {
  currentStep: number;
}

export default function Header({ currentStep }: HeaderProps) {
  const steps = [
    { num: 1, label: "경력 매칭 & 초안" },
    { num: 2, label: "현실성 심층면접" },
    { num: 3, label: "시장분석 보고서" },
    { num: 4, label: "최종 협업 조율" }
  ];

  return (
    <header id="app-header" className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-tr from-brand-700 to-brand-500 text-white p-2.5 rounded-xl shadow-md shadow-brand-500/10">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-100">
                시니어 創業 지원 플랫폼
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight sm:text-2xl">
              세컨드액트<span className="text-brand-600 font-semibold text-lg ml-1">경력형 창업 메이커</span>
            </h1>
          </div>
        </div>

        {/* Step Progression Bar for High Usability */}
        <div className="flex items-center gap-1.5 md:gap-3 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100 max-w-full overflow-x-auto scrollbar-none">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white shadow-xs text-brand-800 font-semibold border border-slate-200/50"
                      : isCompleted
                      ? "text-emerald-600 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : step.num}
                  </span>
                  <span className="text-xs whitespace-nowrap">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
}
