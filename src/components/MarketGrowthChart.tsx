import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { TrendingUp, Percent, Info, HelpCircle, LineChart as LucideLineChart } from "lucide-react";
import { FirstReport } from "../types";

interface MarketGrowthChartProps {
  report: FirstReport | null;
}

interface YearData {
  year: number;
  label: string;
  revenue: number; // in Ten Thousand KRW (만원)
  profit: number; // in Ten Thousand KRW (만원)
}

export default function MarketGrowthChart({ report }: MarketGrowthChartProps) {
  // Scenario: "conservative" or "aggressive"
  const [growthScenario, setGrowthScenario] = useState<"conservative" | "aggressive">("conservative");
  
  // Basic configurations to customize baseline
  // If report exists, try to extract logical annual sales or default to 850 * 12 = 10,200,000 KRW (1억 200만원)
  // Let user customize base monthly sales to reflect simulator or plan
  const [baseSalesInput, setBaseSalesInput] = useState<number>(850); // 만원
  const [fixedCostInput, setFixedCostInput] = useState<number>(220); // 만원
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Generate 5-year data based on chosen growth rates
  const generateData = (): YearData[] => {
    const data: YearData[] = [];
    let currentRevenue = baseSalesInput * 12; // Base Annual Revenue
    const marginRatio = 0.7; // Approx 70% gross profit margin minus fixed costs

    // Growth Rates
    const rates = growthScenario === "conservative" 
      ? [0, 0.04, 0.04, 0.03, 0.03] // Conservative: Year 1: base, then 4%, 4%, 3%, 3%
      : [0, 0.15, 0.20, 0.25, 0.30]; // Aggressive: Year 1: base, then 15%, 20%, 25%, 30%

    for (let i = 0; i < 5; i++) {
      const yearNum = i + 1;
      if (i > 0) {
        currentRevenue = currentRevenue * (1 + rates[i]);
      }
      
      // Approximate profit calculation: Revenue * (1 - variable ratio 15%) - Fixed Costs (fixed * 12)
      const annualFixedCost = fixedCostInput * 12;
      const estimatedProfit = (currentRevenue * 0.85) - annualFixedCost;

      data.push({
        year: yearNum,
        label: `${yearNum}년차`,
        revenue: Math.round(currentRevenue),
        profit: Math.round(Math.max(0, estimatedProfit))
      });
    }
    return data;
  };

  const chartData = generateData();

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll("*").remove();

    // Chart Dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 30, right: 40, bottom: 40, left: 65 };

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background", "#FBFBFA")
      .style("border", "1px solid #E5E3DD");

    // X scale
    const xScale = d3.scalePoint<string>()
      .domain(chartData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    // Y scale (double axis or scaled to fit maximum revenue)
    const maxVal = d3.max(chartData, d => d.revenue) || 10000;
    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Gridlines (Y axis)
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => "")
      )
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "#EBE9E3")
        .attr("stroke-dasharray", "4,4")
      );

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .call(g => g.select(".domain").attr("stroke", "#D1CEC7"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#D1CEC7"))
      .call(g => g.selectAll(".tick text")
        .attr("fill", "#2C3E50")
        .style("font-family", "Inter, sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "600")
      );

    // Y Axis (Revenue label in KRW 만원)
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${d3.format(",")(d)}만`)
      )
      .call(g => g.select(".domain").attr("stroke", "#D1CEC7"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#D1CEC7"))
      .call(g => g.selectAll(".tick text")
        .attr("fill", "#2C3E50")
        .style("font-family", "JetBrains Mono, monospace")
        .style("font-size", "9px")
      );

    // Area Under Revenue Line for modern gradient background look
    const area = d3.area<YearData>()
      .x(d => xScale(d.label) || 0)
      .y0(height - margin.bottom)
      .y1(d => yScale(d.revenue))
      .curve(d3.curveMonotoneX);

    // Gradient definitions
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "revenue-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", growthScenario === "aggressive" ? "#10B981" : "#2C3E50")
      .attr("stop-opacity", 0.15);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", growthScenario === "aggressive" ? "#10B981" : "#2C3E50")
      .attr("stop-opacity", 0.0);

    svg.append("path")
      .datum(chartData)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", "url(#revenue-gradient)");

    // Line generator for Annual Revenue
    const lineRevenue = d3.line<YearData>()
      .x(d => xScale(d.label) || 0)
      .y(d => yScale(d.revenue))
      .curve(d3.curveMonotoneX);

    // Line generator for Annual Profit
    const lineProfit = d3.line<YearData>()
      .x(d => xScale(d.label) || 0)
      .y(d => yScale(d.profit))
      .curve(d3.curveMonotoneX);

    // 1. Draw Profit line (Golden-amber / Sub-metric)
    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#D97706")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3,3")
      .attr("d", lineProfit);

    // 2. Draw Revenue line (Deep Blue or Emerald green / Primary metric)
    const primaryLineColor = growthScenario === "aggressive" ? "#059669" : "#2C3E50";

    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", primaryLineColor)
      .attr("stroke-width", 3)
      .attr("d", lineRevenue);

    // Tooltip div target identifier
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "absolute hidden bg-slate-900 text-white p-2.5 rounded text-[11.5px] shadow-lg pointer-events-none z-35 font-sans leading-normal border border-slate-750");

    // Add interactive circles / hover dots
    chartData.forEach((d) => {
      const cx = xScale(d.label) || 0;
      const cyRev = yScale(d.revenue);
      const cyProf = yScale(d.profit);

      // Revenue point
      const revDot = svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cyRev)
        .attr("r", 5)
        .attr("fill", primaryLineColor)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .attr("id", `dot-rev-${d.year}`);

      // Profit point
      const profDot = svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cyProf)
        .attr("r", 4.5)
        .attr("fill", "#D97706")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .attr("id", `dot-prof-${d.year}`);

      // Combined group mouse hover listening area 
      svg.append("rect")
        .attr("x", cx - 20)
        .attr("y", margin.top)
        .attr("width", 40)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseover", (event) => {
          revDot.transition().duration(100).attr("r", 8);
          profDot.transition().duration(100).attr("r", 7.5);
          
          tooltip.style("display", "block")
            .html(`
              <div class="font-serif font-bold border-b border-zinc-700 pb-1 mb-1 text-amber-400">${d.label} 예상 성과</div>
              <div class="flex justify-between gap-4 font-mono">
                <span class="text-zinc-300">연간 총 매출:</span>
                <strong>${d.revenue.toLocaleString()} 만원</strong>
              </div>
              <div class="flex justify-between gap-4 font-mono text-amber-500">
                <span class="text-zinc-350">연간 순이익:</span>
                <strong>${d.profit.toLocaleString()} 만원</strong>
              </div>
              <div class="text-[9px] text-zinc-400 mt-1 italic border-t border-zinc-800 pt-1">
                ${growthScenario === "aggressive" ? "🔥 적극적 성장 시나리오 반영됨" : "⚖️ 보수적 안심 시나리오 반영됨"}
              </div>
            `);
        })
        .on("mousemove", (event) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            // Find coordinate inside relative div
            const mouseX = event.clientX - containerRect.left + 15;
            const mouseY = event.clientY - containerRect.top - 10;
            tooltip
              .style("left", `${mouseX}px`)
              .style("top", `${mouseY}px`);
          }
        })
        .on("mouseout", () => {
          revDot.transition().duration(100).attr("r", 5);
          profDot.transition().duration(100).attr("r", 4.5);
          tooltip.style("display", "none");
        });
    });

    // Cleanup tooltips on unmount
    return () => {
      tooltip.remove();
    };

  }, [chartData, growthScenario, baseSalesInput, fixedCostInput]);

  return (
    <div id="market-growth-d3-tracker" className="border border-[#E5E3DD] p-5 bg-white space-y-4" ref={containerRef}>
      
      {/* Chart Headers and Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E3DD] pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">D3.js ENGINE / 시장 성장 및 매출 5개년 예측</span>
          <h3 className="font-serif italic text-xl border-l-4 border-[#2C3E50] pl-3 flex items-center gap-2">
            <LucideLineChart className="w-5 h-5 text-slate-700" />
            시장 성장 잠재력 연동 5개년 중장기 예측선
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            기본 월 매출이 복리로 늘어나는 5개년 누적 추세입니다. 점 위에 마우스를 올리면 연간 이익과 매출 실증 수치가 정렬됩니다.
          </p>
        </div>

        {/* Conservative vs Aggressive scenario toggles */}
        <div className="flex bg-[#F1F0EC] p-1 rounded-sm border border-[#D1CEC7] text-xs font-bold gap-1 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setGrowthScenario("conservative")}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              growthScenario === "conservative"
                ? "bg-[#2C3E50] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            📉 보수적 예측 (Conservative)
          </button>
          <button
            type="button"
            onClick={() => setGrowthScenario("aggressive")}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              growthScenario === "aggressive"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            📈 적극적 예측 (Aggressive)
          </button>
        </div>
      </div>

      {/* Dynamic adjust baseline and variables for D3 inside */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FBFBFA] p-3.5 border border-[#E5E3DD] text-xs">
        <div className="space-y-1.5 md:col-span-2">
          <label className="font-bold text-slate-700 block flex items-center gap-1">
            <span>🚀 1차년 기준 월 매출액 설정:</span>
            <span className="font-mono text-[11px] text-[#2C3E50] font-black">{baseSalesInput.toLocaleString()}만원</span>
          </label>
          <input 
            type="range" 
            min="200" 
            max="2500" 
            step="50"
            value={baseSalesInput}
            onChange={(e) => setBaseSalesInput(parseInt(e.target.value))}
            className="w-full accent-[#2C3E50] h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#706C61]">
            <span>200만원</span>
            <span>1,300만원</span>
            <span>2,500만원</span>
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="font-bold text-slate-700 block flex items-center gap-1">
            <span>⚖️ 기준 운영 고정비 (연차 기준 고정 차용):</span>
            <span className="font-mono text-[11px] text-amber-800 font-bold">{fixedCostInput.toLocaleString()}만원</span>
          </label>
          <input 
            type="range" 
            min="50" 
            max="1200" 
            step="10"
            value={fixedCostInput}
            onChange={(e) => setFixedCostInput(parseInt(e.target.value))}
            className="w-full accent-amber-600 h-1.5 bg-[#EBE9E3] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#706C61]">
            <span>50만원</span>
            <span>600만원</span>
            <span>1,200만원</span>
          </div>
        </div>
      </div>

      {/* Main interactive SVG Container and legend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* SVG Drawing Area */}
        <div className="lg:col-span-8 flex justify-center">
          <svg ref={svgRef} className="w-full max-w-full h-auto rounded-sm overflow-visible" />
        </div>

        {/* Quick Readout Legend and Explanations */}
        <div className="lg:col-span-4 bg-[#F2F4F7] p-4 border border-[#D1CEC7] space-y-3.5 text-xs text-slate-800">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">ANALYTICAL LEGEND</span>
            <h4 className="font-serif font-bold text-slate-900 text-sm">범례 및 5개년 누적 성장 타당성</h4>
          </div>

          <div className="space-y-2 text-[11.5px] border-b border-[#D1CEC7] pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-1 inline-block ${growthScenario === "aggressive" ? "bg-[#059669]" : "bg-[#2C3E50]"}`} />
              <strong className="text-slate-900">연간 가맹 총 예상 매출 (만원)</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-[#D97706] inline-block" />
              <strong className="text-amber-800">원가/고정비 공제 연간 순수 이익 (만원)</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">성장률 시나리오 조견표:</span>
            {growthScenario === "conservative" ? (
              <p className="text-[11px] leading-snug text-slate-650">
                🥈 <strong>보수적 시나리오 (매년 +3~4%):</strong> 초기 로컬 거점 중심의 안정 성장 기틀 마련. 무리한 지점 확장이나 무차별식 온라인 광고를 지양하고 4060 세대에 편안한 안전마진을 달성하는 고품격 로컬 마일스톤 기조에 부합합니다.
              </p>
            ) : (
              <p className="text-[11px] leading-snug text-emerald-950">
                🔥 <strong>적극적 성장 시나리오 (매년 +15~30%):</strong> 연륜 있는 프리미엄 네트워크를 본격 확장하여 수도권 지부 개설 및 가맹 가입 수수료 다각화를 연동. Year 5 도달 시 1차년도 매출 대비 <strong>약 2배가 넘는 상방 성장</strong>을 도모하는 시나리오입니다.
              </p>
            )}
          </div>

          <div className="bg-[#FAF8F6] p-2 border-l-2 border-amber-600 text-[10px] text-amber-900 leading-snug">
            <strong>✓ 안정 조언:</strong> 급격한 성장 시나리오일수록 운용 자금 흐름과 체력 한계(과로 리스크) 관리가 뒤따라야 함을 가명 창업가는 잊지 말아야 합니다.
          </div>
        </div>

      </div>

    </div>
  );
}
