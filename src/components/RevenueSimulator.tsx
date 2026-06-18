import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  HelpCircle, 
  Calculator, 
  Zap, 
  AlertCircle, 
  RefreshCw,
  Coins,
  ArrowRight
} from "lucide-react";
import { FirstReport } from "../types";

interface RevenueSimulatorProps {
  report: FirstReport | null;
}

type ScenarioType = "pessimistic" | "neutral" | "optimistic";

export default function RevenueSimulator({ report }: RevenueSimulatorProps) {
  // Extract initial cost from report or default to 3,750,000 KRW (375만원)
  const initialCostTenThousand = report?.costProjection.totalCostExcludingCapital || 375;

  // State inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(initialCostTenThousand);
  const [avgMonthlySales, setAvgMonthlySales] = useState<number>(850); // 기본 850만원
  const [monthlyFixedCost, setMonthlyFixedCost] = useState<number>(220); // 기본 월 고정비 220만원
  const [variableCostRatio, setVariableCostRatio] = useState<number>(15); // 기본 변동비율 15%
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("neutral");

  // Handle Scenario Quick Preset changes
  useEffect(() => {
    if (selectedScenario === "pessimistic") {
      setAvgMonthlySales(500); // 비관적: 매출 저조 (500만원)
      setMonthlyFixedCost(200); // 고정비 최대한 타이트하게 (200만원)
      setVariableCostRatio(20); // 변동비 상승 (20%)
    } else if (selectedScenario === "neutral") {
      setAvgMonthlySales(850); // 중립적: 설계원안 (850만원)
      setMonthlyFixedCost(220); // 평균 고정비 (220만원)
      setVariableCostRatio(15); // 표준 변동비 (15%)
    } else if (selectedScenario === "optimistic") {
      setAvgMonthlySales(1300); // 낙관적: 영업 호조 (1300만원)
      setMonthlyFixedCost(250); // 적극 마케팅 고정비 증가 (250만원)
      setVariableCostRatio(12); // 생산 효율로 변동비 절감 (12%)
    }
  }, [selectedScenario]);

  // Derived Calculations
  // 1. Variable Cost = Sales * (Ratio / 100)
  const monthlyVariableCost = Math.round(avgMonthlySales * (variableCostRatio / 100));
  
  // 2. Gross profit per month (월 공헌 이익 = 월 매출 - 변동비 - 고정비)
  const monthlyGrossProfit = avgMonthlySales - monthlyFixedCost - monthlyVariableCost;

  // 3. Breakeven point in months (손익분기 개월수 = 초기투자 / 월 공헌이익)
  const breakevenMonths = monthlyGrossProfit > 0 
    ? parseFloat((initialInvestment / monthlyGrossProfit).toFixed(1)) 
    : Infinity;

  // 4. Year Cumulative Profits for monthly projection (12 months)
  const monthlyProjections = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Cumulative profit = (Monthly Profit * Month) - Initial Investment
    const cumulativeProfit = (monthlyGrossProfit * month) - initialInvestment;
    return {
      month,
      sales: avgMonthlySales * month,
      cumulativeProfit,
      isProfitable: cumulativeProfit >= 0
    };
  });

  return (
    <div id="revenue-simulator-panel" className="border-2 border-[#2C3E50] p-5 bg-white relative space-y-5 rounded-xs hover:shadow-xs transition-shadow">
      
      {/* Header section */}
      <div className="border-b border-[#E5E3DD] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
            시니어 안심 자산계산기
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Calculator className="w-4.5 h-4.5 text-[#2C3E50]" />
            실시간 수익성 & 손익분기점(BEP) 시뮬레이터
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            대표님이 생각하시는 낙관/비관 시나리오별 수치를 조절하세요. 1~12개월차 누적 손익 곡선이 실시간 실증 연동됩니다.
          </p>
        </div>
        
        {/* Scenario Selection Presets */}
        <div className="flex bg-[#F1F0EC] p-1 rounded-sm border border-[#D1CEC7] text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedScenario("pessimistic")}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              selectedScenario === "pessimistic"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-650 hover:bg-slate-200"
            }`}
          >
            😰 비관 시나리오
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario("neutral")}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              selectedScenario === "neutral"
                ? "bg-[#2C3E50] text-white shadow-xs"
                : "text-slate-650 hover:bg-slate-200"
            }`}
          >
            ⚖️ 중립 (설계 원안)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario("optimistic")}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              selectedScenario === "optimistic"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-650 hover:bg-slate-200"
            }`}
          >
            🚀 낙관 시나리오
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Visual Gauge & Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 leading-relaxed text-xs">
        
        {/* INPUT COLUMN: Slider and Number Fields */}
        <div className="lg:col-span-5 bg-[#FAFBFB] p-4 border border-[#E5E3DD] space-y-4">
          <h4 className="font-serif font-bold text-[12px] text-slate-800 border-b border-[#E5E3DD] pb-1.5 flex justify-between items-center">
            <span>🔧 시뮬레이션 매개변수 조정</span>
            <span className="font-sans text-[10px] text-slate-400 font-normal">직접 값을 입력하거나 슬라이더를 옮기세요.</span>
          </h4>

          {/* 1. Initial Investment Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <strong className="text-slate-700 font-medium">① 초기 창업 비용 (자본예산)</strong>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  value={initialInvestment} 
                  onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-18 text-right bg-white border border-[#D1CEC7] px-1.5 py-0.5 font-bold font-mono text-slate-900 rounded-xs"
                />
                <span className="text-slate-500 text-[10px]">만원</span>
              </div>
            </div>
            <input 
              type="range" 
              min="50" 
              max="1500" 
              step="10"
              value={initialInvestment} 
              onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
              className="w-full accent-[#2C3E50] h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#706C61]">
              <span>50만원</span>
              <span>750만원</span>
              <span>1,500만원</span>
            </div>
          </div>

          {/* 2. Monthly Expected Sales */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <strong className="text-slate-700 font-medium text-emerald-800">② 월 평균 예상 영업 매출액</strong>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  value={avgMonthlySales} 
                  onChange={(e) => setAvgMonthlySales(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-18 text-right bg-white border border-emerald-300 px-1.5 py-0.5 font-bold font-mono text-emerald-800 rounded-xs"
                />
                <span className="text-slate-500 text-[10px]">만원</span>
              </div>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2500" 
              step="50"
              value={avgMonthlySales} 
              onChange={(e) => setAvgMonthlySales(parseInt(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#706C61]">
              <span>100만원</span>
              <span>1,300만원</span>
              <span>2,500만원</span>
            </div>
          </div>

          {/* 3. Monthly Fixed Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <strong className="text-slate-700 font-medium text-amber-900">③ 월 고정 운영비 (임대료, 인건비 등)</strong>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  value={monthlyFixedCost} 
                  onChange={(e) => setMonthlyFixedCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-18 text-right bg-white border border-amber-300 px-1.5 py-0.5 font-bold font-mono text-amber-900 rounded-xs"
                />
                <span className="text-slate-500 text-[10px]">만원</span>
              </div>
            </div>
            <input 
              type="range" 
              min="20" 
              max="900" 
              step="10"
              value={monthlyFixedCost} 
              onChange={(e) => setMonthlyFixedCost(parseInt(e.target.value))}
              className="w-full accent-amber-700 h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#706C61]">
              <span>20만원</span>
              <span>460만원</span>
              <span>900만원</span>
            </div>
          </div>

          {/* 4. Variable cost ratio */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <strong className="text-slate-700 font-medium">④ 원재료/유통 변동비율</strong>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  value={variableCostRatio} 
                  onChange={(e) => setVariableCostRatio(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-12 text-right bg-white border border-[#D1CEC7] px-1.5 py-0.5 font-bold font-mono text-slate-900 rounded-xs"
                />
                <span className="text-slate-500 text-[10px]">%</span>
              </div>
            </div>
            <input 
              type="range" 
              min="0" 
              max="80" 
              step="1"
              value={variableCostRatio} 
              onChange={(e) => setVariableCostRatio(parseInt(e.target.value))}
              className="w-full accent-slate-600 h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#706C61]">
              <span>0% (순수 서비스)</span>
              <span>40%</span>
              <span>80% (고유 가공유통)</span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#FAF8F6] border border-amber-200 p-2.5 rounded-sm text-[10px] text-amber-900 flex gap-2">
            <Coins className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
            <span>
              <strong>변동비 가산 결과:</strong> 매출 상정에 따라 매달 약 <strong>{monthlyVariableCost}만원</strong>의 추가 지출 재고비가 연쇄 산입되고 남는 금액이 공헌 이익이 됩니다.
            </span>
          </div>

        </div>

        {/* OUTPUT ANALYSIS COLUMN: Speedometers & Graphs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* BEP result card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Monthly Profit Card */}
            <div className="border border-[#E5E3DD] p-4 bg-[#FBFBFA] rounded-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">MONTHLY MARGIN</span>
                <h5 className="font-serif font-black text-slate-900 text-xs">매월 누적 순수 상방 순이익</h5>
                <p className="text-[10px] text-slate-500 leading-tight">매출액 - (고정비 + 변동비) 공제액</p>
              </div>

              <div className="mt-3.5">
                <span className={`text-2xl font-serif font-black italic tracking-tight ${monthlyGrossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {monthlyGrossProfit >= 0 ? "+" : ""}
                  {monthlyGrossProfit.toLocaleString()} 만원 / 월
                </span>
              </div>
              
              <div className="mt-2 text-[10px] leading-tight text-slate-500 border-t border-[#F0EFEA] pt-1.5">
                {monthlyGrossProfit > 0 ? (
                  <span className="text-emerald-800 font-semibold">✓ 안전 흑자 궤도 가동 중</span>
                ) : (
                  <span className="text-rose-600 font-bold">⚠️ 경보: 월별 적자 누적 자본 잠식 주의!</span>
                )}
              </div>
            </div>

            {/* Breakeven Month card */}
            <div className="border border-[#2C3E50] p-4 bg-[#2C3E50] text-[#F9F8F6] rounded-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">BREAKEVEN POINT (BEP)</span>
                <h5 className="font-serif font-bold text-[#FAF8F6] text-xs">원금 회수 성공 및 안심 분기점</h5>
                <p className="text-[10px] text-zinc-300 leading-tight">초기 비용 회수 소요 추정 개월</p>
              </div>

              <div className="mt-3.5 flex items-baseline gap-1">
                {breakevenMonths === Infinity ? (
                  <span className="text-xl font-bold text-rose-400">회수 불가 (적자 상태)</span>
                ) : (
                  <>
                    <span className="text-3xl font-serif font-semibold text-amber-400 italic">
                      {breakevenMonths}
                    </span>
                    <span className="text-xs">개월 차 돌파</span>
                  </>
                )}
              </div>

              <div className="mt-2 text-[10px] leading-tight text-zinc-300 border-t border-zinc-700 pt-1.5">
                {breakevenMonths !== Infinity && breakevenMonths <= 6 ? (
                  <span className="text-emerald-400 font-bold">★ 6개월 이내의 극소 최고 회수율!</span>
                ) : breakevenMonths !== Infinity && breakevenMonths <= 12 ? (
                  <span className="text-amber-300 font-medium">안정적인 1년 내 원금 회수 안착</span>
                ) : (
                  <span className="text-zinc-400">고정비 축소 또는 매출 상방 판로 확장 긴급 피드백 권고</span>
                )}
              </div>
            </div>
            
          </div>

          {/* Visualization: Interactive Bar representation of 12-Month Cumulative Profit */}
          <div className="border border-[#E5E3DD] p-4 bg-[#FBFBFA]">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              PROJECTION TIMELINE / 12개월 누적 손익 곡선
            </span>
            <h4 className="font-serif font-bold text-slate-850 mb-3 text-[11px] flex justify-between">
              <span>월별 누적 부채 해소 & 흑자 누적액 (단위: 만원)</span>
              {monthlyGrossProfit > 0 && (
                <span className="text-emerald-700 font-bold font-sans">
                  연간 순익 합계: +{(monthlyGrossProfit * 12 - initialInvestment).toLocaleString()}만원
                </span>
              )}
            </h4>

            {/* Cumulative Profit Horizontal bar simulation */}
            <div className="space-y-1.5">
              {monthlyProjections.filter((_, idx) => idx % 2 === 0 || idx === 11).map((proj) => {
                // Determine width calculations for bar graph
                // Absolute max can be defined to prevent overflow
                const maxVal = Math.max(100, Math.abs(avgMonthlySales * 12));
                const posPercent = Math.min(100, Math.max(0, (proj.cumulativeProfit / maxVal) * 100));
                const absPercent = Math.min(50, Math.abs(proj.cumulativeProfit) / (maxVal * 2) * 100);

                return (
                  <div key={proj.month} className="flex items-center gap-2">
                    <span className="w-13 text-[10px] font-mono text-slate-600 font-bold shrink-0">
                      {proj.month}개월 차 :
                    </span>
                    
                    {/* Visual Bar Container */}
                    <div className="flex-1 bg-[#F0EFEA] h-5 relative rounded-xs overflow-hidden flex items-center">
                      {/* Zero line reference inside card */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-350 z-10" />

                      {/* Profit Fill (Right from center) */}
                      {proj.cumulativeProfit >= 0 ? (
                        <div 
                          className="absolute left-1/2 bg-emerald-600 h-full rounded-r-xs opacity-85 transition-all duration-300"
                          style={{ width: `${Math.min(50, (proj.cumulativeProfit / (initialInvestment * 2 || 100)) * 50)}%` }}
                        />
                      ) : (
                        /* Debt / Deficit Fill (Left from center, extending leftwards) */
                        <div 
                          className="absolute bg-rose-500 h-full rounded-l-xs opacity-70 transition-all duration-300"
                          style={{ 
                            right: "50%", 
                            width: `${Math.min(50, (Math.abs(proj.cumulativeProfit) / (initialInvestment || 100)) * 50)}%` 
                          }}
                        />
                      )}

                      {/* Display numeric overlay inside */}
                      <span className={`absolute text-[9px] font-bold font-mono z-20 ${proj.cumulativeProfit >= 0 ? 'left-[calc(50%+6px)] text-emerald-950' : 'right-[calc(50%+6px)] text-rose-950'}`}>
                        {proj.cumulativeProfit >= 0 ? "+" : ""}
                        {proj.cumulativeProfit.toLocaleString()}만원
                      </span>
                    </div>

                    {/* Badge Indicator */}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap ${proj.isProfitable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {proj.isProfitable ? "자본회수완료" : "상쇄 진행중"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-[#E5E3DD] pt-3 text-[11px] text-[#5C3A21] italic leading-relaxed flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>💡 실무 핏 가이드:</strong> 초기 비용이 <strong>{initialInvestment}만원</strong>일 때, 월정액 기반 recurring 고정 수입을 최대한 초기에 다질수록 손익분기 도달 소요 개월이 획기적으로 줄어듭니다. 시니어 사장님은 체력이 허락하는 최소 한계치(BEP 마진 월 300만원 이상 확보 구간)를 설정하신 뒤 본격 실전에 가맹하시는 것을 추천합니다.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
