import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Flag, 
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  BookmarkCheck
} from "lucide-react";
import { FirstReport, RoadmapStage } from "../types";

interface InteractiveTimelineProps {
  report: FirstReport | null;
}

// Default items if customization is needed base on phase indexes
const DEFAULT_TASKS_BY_STAGE: { [key: number]: string[] } = {
  0: [
    "상권 분석 및 유동 인구 정밀 실사",
    "사업자등록증 신청 및 인허가 요건 완비",
    "원재료 유통망 및 파트너 계약 체결",
    "초기 소요 자본 6개월치 안전예비구좌 분리"
  ],
  1: [
    "로컬 커뮤니티(아파트 단지, 구청 등) 온오프라인 마케팅 실시",
    "핵심 가맹 서비스 시범 가동 및 고객 피드백 수집",
    "1차 시그니처 상품/자문 패키지 릴리즈 및 가격 최적화",
    "초기 단골 고객 50명 연계 명단 구축"
  ],
  2: [
    "매출 세부 구조 분석 및 고정비 절감 설계 실행",
    "B2B 제휴 제안서 작성 및 은퇴 연동 채널 매칭 시도",
    "운영 실무 공정도 표준 템플릿화 (대표 부하 50% 감축)",
    "월 고정 손익분기점 안정적 도달 달성 검증"
  ],
  3: [
    "시니어 시각에 집중된 체력 완배 마일스톤 정비",
    "고유 브랜드 상표권 출원 및 가맹 사업(프랜차이즈) 모델 수립",
    "지역 거점 핵심 거점 매장 2호점 제안 계약 체결",
    "월 상방 매출 1300만원 달성 및 지속가능한 인수인계 체계 구축"
  ]
};

export default function InteractiveTimeline({ report }: InteractiveTimelineProps) {
  const steps = report?.roadmap || [];

  // Expanded card state - default to first card open
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  // Map representation of task states to keep track of completed checklist item IDs
  // structure: { [stageIndex]: { [taskIndex]: boolean } }
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({
    "0-0": true,
    "0-1": false,
    "0-2": false,
    "0-3": false,
    "1-0": false,
    "1-1": false,
    "1-2": false,
    "2-0": false,
    "3-0": false,
  });

  // Unique custom tasks added by user
  const [customTasks, setCustomTasks] = useState<{ [key: number]: string[] }>({});
  const [newTaskText, setNewTaskText] = useState<{ [key: number]: string }>({});

  if (steps.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500 font-serif">
        마일스톤 로드맵 데이터가 준비되지 않았습니다.
      </div>
    );
  }

  // Toggle checklist complete
  const toggleTask = (stageIdx: number, taskIdx: number, isCustom = false) => {
    const key = isCustom ? `custom-${stageIdx}-${taskIdx}` : `${stageIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Add customized task to stage
  const addCustomTask = (stageIdx: number) => {
    const text = newTaskText[stageIdx]?.trim();
    if (!text) return;

    setCustomTasks(prev => {
      const existing = prev[stageIdx] || [];
      return {
        ...prev,
        [stageIdx]: [...existing, text]
      };
    });

    setNewTaskText(prev => ({
      ...prev,
      [stageIdx]: ""
    }));
  };

  // Delete custom task
  const deleteCustomTask = (stageIdx: number, taskIdx: number) => {
    setCustomTasks(prev => {
      const existing = prev[stageIdx] || [];
      const updated = [...existing];
      updated.splice(taskIdx, 1);
      return {
        ...prev,
        [stageIdx]: updated
      };
    });

    // Clean check state
    const key = `custom-${stageIdx}-${taskIdx}`;
    setCompletedTasks(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  return (
    <div id="interactive-roadmap-timeline-tracker" className="border-2 border-[#2C3E50] p-5 bg-white relative space-y-5 rounded-xs">
      
      {/* Module Title and Status block */}
      <div className="border-b border-[#E5E3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            실천 지원 엔진
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <BookmarkCheck className="w-4.5 h-4.5 text-[#2C3E50]" />
            실무 4단계 인터랙티브 감동 마일스톤
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            각 단계를 마우스로 클릭하여 <strong>비공개 실천 체크리스트</strong>를 확장하세요. 항목을 체크하면서 은퇴 후 제2막 실전 창업 계획을 하나씩 실현하세요.
          </p>
        </div>

        {/* Global Progress Gauge to gamify action completion */}
        <div className="bg-[#FAF8F5] border border-[#D1CEC7] p-2.5 rounded-xs text-xs font-serif shrink-0">
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-500 font-sans">
            <span>나의 총 실천 진척도</span>
            <span className="font-mono font-bold text-[#2C3E50]">
              {Math.round(
                (Object.values(completedTasks).filter(Boolean).length / 
                (16 + Object.values(customTasks).flatMap(x => x).length || 1)) * 100
              )}% 완료
            </span>
          </div>
          <div className="w-44 bg-[#EBE9E3] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (Object.values(completedTasks).filter(Boolean).length / (16 + Object.values(customTasks).flatMap(x => x).length || 1)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Timeline Layout */}
      <div className="space-y-4">
        {steps.map((stage, idx) => {
          const isActive = activeStageIdx === idx;
          const defaultTasks = DEFAULT_TASKS_BY_STAGE[idx] || [
            "기본 시장 조사 및 입지 적합성 판단",
            "세무 노무 자문 컨설턴트 및 대행사 계약 검토",
            "로컬 주요 인프라 제안서 초교 구성",
            "실시간 손익 시뮬레이션 모델 테스트 수행"
          ];
          const customList = customTasks[idx] || [];
          const allTasksCount = defaultTasks.length + customList.length;

          // count completed in this stage
          let completedInStageCount = 0;
          defaultTasks.forEach((_, tIdx) => {
            if (completedTasks[`${idx}-${tIdx}`]) completedInStageCount++;
          });
          customList.forEach((_, tIdx) => {
            if (completedTasks[`custom-${idx}-${tIdx}`]) completedInStageCount++;
          });

          return (
            <div 
              key={idx} 
              className={`border transition-all duration-300 ${
                isActive 
                  ? "border-emerald-600 ring-1 ring-emerald-600/30 bg-[#F6FAF7]" 
                  : "border-[#E5E3DD] bg-white hover:bg-[#FAF9F5]"
              }`}
            >
              {/* Header: Clickable target summary line */}
              <div 
                onClick={() => setActiveStageIdx(isActive ? -1 : idx)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  {/* Step indicator Circle */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs font-mono transition-colors ${
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : completedInStageCount === allTasksCount 
                        ? "bg-emerald-200 text-emerald-900"
                        : "bg-[#2C3E50] text-[#F9F8F6]"
                  }`}>
                    {completedInStageCount === allTasksCount ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                    ) : (
                      `0${idx + 1}`
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide ${
                        isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-slate-600"
                      }`}>
                        {stage.phase} ({stage.timeline})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        체크 완료: {completedInStageCount}/{allTasksCount}
                      </span>
                    </div>
                    <h4 className="font-serif font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal line-clamp-1">
                      {stage.coreGoal}
                    </p>
                  </div>
                </div>

                {/* Chevron icon indicator */}
                <div className="text-slate-400 shrink-0 self-center">
                  {isActive ? <ChevronUp className="w-5 h-5 text-emerald-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsed/Expanded Action Panel utilizing smooth Framer Motion height expansion */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-[#E5E3DD]/80 bg-white"
                  >
                    <div className="p-4 space-y-4 text-xs text-slate-800">
                      
                      {/* Master Core Goal breakdown card */}
                      <div className="bg-[#FAF8F5] p-3 border-l-2 border-[#2C3E50]">
                        <h5 className="font-serif font-bold text-slate-900 mb-1 block flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5 text-amber-600" />
                          본 마일스톤 집중 실행 목표
                        </h5>
                        <p className="text-[11.5px] leading-relaxed text-slate-700">
                          {stage.coreGoal}
                        </p>
                      </div>

                      {/* CHECKLIST LIST */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          📋 실천 체크리스트 (클릭해서 체크해 나가세요)
                        </span>

                        {/* Rendering Default items */}
                        <div className="space-y-2.5">
                          {defaultTasks.map((task, tIdx) => {
                            const isChecked = !!completedTasks[`${idx}-${tIdx}`];
                            return (
                              <div 
                                key={tIdx}
                                onClick={() => toggleTask(idx, tIdx, false)}
                                className={`flex items-start gap-2.5 p-2 border rounded-sm transition-colors cursor-pointer select-none ${
                                  isChecked 
                                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                                )}
                                <span className={`text-[11.5px] leading-snug ${isChecked ? "line-through opacity-65" : ""}`}>
                                  {task}
                                </span>
                              </div>
                            );
                          })}

                          {/* Rendering Custom Added items if any */}
                          {customList.map((task, tIdx) => {
                            const isChecked = !!completedTasks[`custom-${idx}-${tIdx}`];
                            return (
                              <div 
                                key={`custom-${tIdx}`}
                                className={`flex items-start justify-between gap-1.5 p-2 border rounded-sm transition-colors ${
                                  isChecked 
                                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                <div 
                                  onClick={() => toggleTask(idx, tIdx, true)}
                                  className="flex items-start gap-2.5 cursor-pointer flex-1 select-none"
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-[11.5px] leading-snug ${isChecked ? "line-through opacity-65" : ""}`}>
                                    {task}
                                    <span className="text-[9px] text-amber-800 bg-amber-50 border border-amber-200 px-1 ml-1.5 font-sans font-bold">나의 실사</span>
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => deleteCustomTask(idx, tIdx)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-sm transition-colors"
                                  title="할 일 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ADD CUSTOM TASK FIELD */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="시사장으로서 추가할 나만의 구체적인 액션을 적으세요..."
                          value={newTaskText[idx] || ""}
                          onChange={(e) => setNewTaskText(prev => ({ ...prev, [idx]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomTask(idx);
                            }
                          }}
                          className="flex-1 bg-white border border-[#D1CEC7] px-3 py-1.5 rounded-sm text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomTask(idx)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>할일 등록</span>
                        </button>
                      </div>

                      {/* KPI indicators card */}
                      <div className="bg-[#FAFBFB] p-2.5 border-t border-[#EBE9E3] flex justify-between items-center text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2C3E50]" />
                          <span><strong>본 단계 성공판단 KPI 지표:</strong></span>
                          <span className="italic font-bold text-slate-800 ml-1">"{stage.indicator}"</span>
                        </div>
                        <span className="text-[#207f59] font-sans font-bold uppercase tracking-wider text-[9px] bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded-sm">
                          ON TRACK
                        </span>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
