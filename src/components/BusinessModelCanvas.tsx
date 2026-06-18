import { 
  Users, 
  Activity, 
  Sparkles, 
  Heart, 
  Target, 
  Key, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Award,
  ChevronRight,
  TrendingDown,
  Hammer
} from "lucide-react";
import { CareerProfile, ProposalDraft, FirstReport } from "../types";

interface BusinessModelCanvasProps {
  profile: CareerProfile;
  draft: ProposalDraft | null;
  report: FirstReport | null;
}

export default function BusinessModelCanvas({ profile, draft, report }: BusinessModelCanvasProps) {
  // Graceful falling back content mapping
  const businessName = draft?.businessName || "시니어 실무 협업 창업";

  // 1. Key Partners (핵심 파트너)
  const partners = [
    "지자체 시니어/중장년 기술창업 지원재단 및 지식재산 바우처 지원제",
    profile.strengths?.includes("네트워크") || profile.strengths?.includes("인적")
      ? `보유 중인 업계 실무 고위 네트워크 및 원부자재 안심 공급 얼라이언스`
      : "기존 인적 신인 채널 및 동종 기술 자문 연대",
    `초기 1~5호 가혹지 무료 시범 파일럿 수행 파트너 및 만족 우호 기업인들`,
    "시니어 지식 특허 출원 전문 변리사 및 기술 보증 제휴 공인 협회"
  ];

  // 2. Key Activities (핵심 활동)
  const activities = [
    `시니어의 전문 연륜 이식형 맞춤형 정밀 진단 및 월정액 모바일 카탈로그 배포`,
    draft?.productService ? `제품/서비스 핵심 공정: ${draft.productService.split("1단계:")[0]?.trim() || draft.productService.substring(0, 70)}...` : "밀착 실전 오프라인 기술 감리 및 상시 비상 모니터링 대응",
    "B2B 전용 연계 정기 미팅 및 현업 고충 해결을 위한 지름길 가이드 발급",
    "공동 타겟을 위한 시니어 은퇴 컨설턴트 2~3인 보조 전문 자산 교육 관리화"
  ];

  // 3. Value Propositions (핵심 가치 제안)
  const propositions = [
    draft?.uniqueValueProposition 
      ? `독점 가치: ${draft.uniqueValueProposition}` 
      : `수십 년 연륜 기반 무기: 일반 신인 스타트업 대비 리스크 2.5배 감축`,
    `대기업 지명 영입 마스터의 수십 년 실전 안전/유통/가공 밀착 노하우 직강`,
    "성과 수기 100% 실증 기반, 실패 시 보장 환불을 내건 신용 거래 장벽 구축",
    "표준 템플릿화를 통한 불필요한 현장 과몰입 체력 고갈 탈피 및 가동률 확보"
  ];

  // 4. Customer Relationships (고객 관계)
  const relationships = [
    "1:1 대면 맞춤식 프리미엄 멤버십 자문 및 책임 연간 정비 관리 보증",
    "대표의 시그니처 안전 사후점검 교부서를 통한 무조건적 심리적 안전막 공급",
    "초기 소수의 핵심 만족 기업 중심의 구전 소개 마케팅 및 강력한 신뢰 락인(Lock-in)"
  ];

  // 5. Customer Segments (고객 세그먼트)
  const segments = [
    `주 타겟: ${profile.target || "공략 도메인 중소 사업장 및 대표님들"}`,
    draft?.targetCustomers ? `상세 타겟: ${draft.targetCustomers}` : "기능 및 대기업급 운영 수칙이 시급하지만 비용 한계에 부딪힌 현실 기업군",
    "단기 카피캣 기술력에 속아 사후관리 먹튀를 당해 안전장치가 시급한 예비 수요층"
  ];

  // 6. Key Resources (핵심 자원)
  const resources = [
    `창업 대표의 ${profile.years} 누적 ${profile.field || "전문 도메인"} 정밀 지식 자산`,
    profile.strengths ? `베테랑 특유의 독보적 강점: ${profile.strengths}` : "인적 보증 신용도와 위기 수습 행동 매뉴얼 및 네트워크",
    report ? `총 가용 소요 예비 예산: 약 ${report.costProjection.totalCostExcludingCapital}만원 (안전 버퍼 격리 분량 확보)` : "초기 투자 소요 실 자산"
  ];

  // 7. Channels (채널)
  const channels = [
    "전문성 포트폴리오를 우아하게 시각화시킨 하이엔드 반응형 모바일 계약 사이트",
    "지인 추천 연대 채널 및 지역 소상공인 연합회 정기 기술 포럼 자문 세션",
    "현직 대표/공장장 방문을 통한 면대면 영업 및 기획 브로셔 다이렉트 배포"
  ];

  // 8. Cost Structure (비용 구조)
  const costs = report ? [
    `사무 입차/공유거점 보정 예산: 약 ${report.costProjection.items[0]?.amount || 0}만원`,
    `온라인 포트폴리오 및 기술 증빙 전산 구축: 약 ${report.costProjection.items[1]?.amount || 0}만원`,
    `초기 10개처 표적 마케팅 및 무료 시범 수탁비: 약 ${report.costProjection.items[2]?.amount || 0}만원`,
    `인건비 완충/안전 운영 리스크 보전비: 약 ${report.costProjection.items[3]?.amount || 0}만원`,
    `총합 최소비 배치: 약 ${report.costProjection.totalCostExcludingCapital}만원`
  ] : [
    "역세권 소규모 연계 스마트 공유거점 임차",
    "누적 경력 신증 증명 웹브로셔 및 포트폴리오 구축비",
    "소상공인 무료 파일럿 패키지 세일즈 초기 비용",
    "지식 특허 법인 등기 인허가 수수료"
  ];

  // 9. Revenue Streams (수익원)
  const revenues = report ? [
    ...report.financialStrategy.split("\n").filter(line => line.trim().length > 0).map(line => line.replace(/^\d+\.\s*/, "").trim()),
    "월정액 정기 케어 패키지 구독수입 (MRR 안정화)",
    "성과 연계 보너스 인센티브 (수익 상방 오픈)"
  ].slice(0, 4) : [
    "월간 정기 모니터링 수수료 및 솔루션 관리 구독 팩 (MRR)",
    "기존 핵심 기술 이식 및 정밀 진단 1회성 마스터 코칭 피",
    "연간 성과 개선 및 고정 비용 절감 비례 퍼포먼스 인센티브 보상액"
  ];

  return (
    <div className="border-4 border-[#2C3E50] p-6 bg-white relative space-y-6 select-none print:p-2 print:border-2">
      {/* Decorative Vintage Stamps */}
      <span className="absolute top-2 right-4 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none">
        BizPro BMC Matrix v2.1
      </span>
      
      {/* Canvas Header */}
      <div className="border-b-2 border-double border-[#D1CEC7] pb-4 text-center">
        <span className="text-[#2C3E50] font-bold text-[10px] uppercase tracking-[0.25em] mb-1 block">
          9-Block Business Model Canvas
        </span>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-900 font-extrabold tracking-tight">
          선생님의 경력연계 [{businessName}] 비즈니스 모델 캔버스
        </h2>
        <p className="text-[11px] text-[#706C61] mt-1 italic max-w-2xl mx-auto">
          가장 직관적으로 창업의 핵심 성공 전제와 파트너, 가치제안, 비용/수익 역학을 대조할 수 있는 글로벌 표준 9개 그리드 판넬입니다. 좌측의 챗봇으로 내용을 수정하면 캔버스 역시 영리하게 실시간 반응 변동됩니다.
        </p>
      </div>

      {/* 2D Grid Layout of Business Model Canvas (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:grid-rows-3 gap-3 text-xs">
        
        {/* ROW 1 & ROW 2 Combined: Columns block */}
        
        {/* Block 1: Key Partners */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 border border-[#D1CEC7] p-3.5 bg-[#FAFBFB] flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2.5 border-b border-[#D1CEC7]/60 pb-1.5">
              <Users className="w-4 h-4 shrink-0" />
              <span className="font-serif text-[12px]">핵심 파트너<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Key Partners)</span></span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
              {partners.map((p, idx) => (
                <li key={idx} className="flex gap-1.5 items-start">
                  <span className="text-[#2C3E50] font-bold shrink-0 mt-0.5">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[9px] text-[#D1CEC7] font-mono mt-4 self-end">BLOCK 01</span>
        </div>

        {/* Column 2: Key Activities & Key Resources */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-3 lg:row-span-2">
          
          {/* Block 2: Key Activities */}
          <div className="flex-1 border border-[#D1CEC7] p-3.5 bg-white flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2 border-b border-[#D1CEC7]/60 pb-1.5">
                <Activity className="w-4 h-4 shrink-0" />
                <span className="font-serif text-[12px]">핵심 활동<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Key Activities)</span></span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-755 leading-relaxed">
                {activities.map((a, idx) => (
                  <li key={idx} className="flex gap-1 items-start">
                    <span className="text-[#2C3E50] font-bold shrink-0">·</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D1CEC7] font-mono mt-2 self-end">BLOCK 02</span>
          </div>

          {/* Block 6: Key Resources */}
          <div className="flex-1 border border-[#D1CEC7] p-3.5 bg-white flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2 border-b border-[#D1CEC7]/60 pb-1.5">
                <Key className="w-4 h-4 shrink-0" />
                <span className="font-serif text-[12px]">핵심 자원<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Key Resources)</span></span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-755 leading-relaxed">
                {resources.map((r, idx) => (
                  <li key={idx} className="flex gap-1 items-start">
                    <span className="text-[#2C3E50] font-bold shrink-0">·</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D1CEC7] font-mono mt-2 self-end">BLOCK 06</span>
          </div>
        </div>

        {/* Block 3: Value Propositions */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 border border-[#D1CEC7] p-3.5 bg-[#FAF1EC] flex flex-col justify-between hover:shadow-xs transition-all rounded-xs">
          <div>
            <div className="flex items-center gap-1.5 text-[#E67E22] font-bold mb-2.5 border-b border-[#E5D2C2] pb-1.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="font-serif text-[12px]">핵심 가치 제안<br/><span className="text-[9px] text-[#C0392B] font-sans font-normal">(Value Propositions)</span></span>
            </div>
            <ul className="space-y-2 text-[11px] text-[#5C3A21] leading-relaxed">
              {propositions.map((p, idx) => (
                <li key={idx} className="flex gap-1.5 items-start">
                  <span className="text-[#E67E22] font-bold shrink-0 mt-0.5">★</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[9px] text-[#E5D2C2] font-mono mt-4 self-end">BLOCK 03</span>
        </div>

        {/* Column 4: Customer Relationships & Channels */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-3 lg:row-span-2 shadow-none">
          
          {/* Block 4: Customer Relationships */}
          <div className="flex-1 border border-[#D1CEC7] p-3.5 bg-white flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2 border-b border-[#D1CEC7]/60 pb-1.5">
                <Heart className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-serif text-[12px]">고객 관계<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Customer Relationships)</span></span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-755 leading-relaxed">
                {relationships.map((rel, idx) => (
                  <li key={idx} className="flex gap-1 items-start">
                    <span className="text-rose-500 font-bold shrink-0">·</span>
                    <span>{rel}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D1CEC7] font-mono mt-2 self-end">BLOCK 04</span>
          </div>

          {/* Block 7: Channels */}
          <div className="flex-1 border border-[#D1CEC7] p-3.5 bg-white flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2 border-b border-[#D1CEC7]/60 pb-1.5">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="font-serif text-[12px]">채널<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Channels)</span></span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-755 leading-relaxed">
                {channels.map((ch, idx) => (
                  <li key={idx} className="flex gap-1 items-start">
                    <span className="text-[#2C3E50] font-bold shrink-0">·</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D1CEC7] font-mono mt-2 self-end">BLOCK 07</span>
          </div>
        </div>

        {/* Block 5: Customer Segments */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 border border-[#D1CEC7] p-3.5 bg-[#FAFBFB] flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2.5 border-b border-[#D1CEC7]/60 pb-1.5">
              <Target className="w-4 h-4 shrink-0" />
              <span className="font-serif text-[12px]">고객 세그먼트<br/><span className="text-[9px] text-[#706C61] font-sans font-normal">(Customer Segments)</span></span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
              {segments.map((seg, idx) => (
                <li key={idx} className="flex gap-1.5 items-start">
                  <span className="text-[#2C3E50] font-bold shrink-0 mt-0.5">■</span>
                  <span>{seg}</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[9px] text-[#D1CEC7] font-mono mt-4 self-end">BLOCK 05</span>
        </div>

        {/* BOTTOM ROW: Split in two half sections */}
        
        {/* Block 8: Cost Structure */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-1 border border-[#D1CEC7] p-3.5 bg-[#FAF8F6] flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center gap-1.5 text-[#2C3E50] font-bold mb-2 border-b border-[#D1CEC7]/60 pb-1.5">
              <DollarSign className="w-4 h-4 shrink-0 text-[#C0392B]" />
              <span className="font-serif text-[12px]">비용 구조 <span className="font-sans font-normal text-[10px] text-slate-500">(Cost Structure)</span></span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-700 leading-normal">
              {costs.map((c, idx) => (
                <li key={idx} className="flex gap-1 items-start">
                  <span className="text-[#C0392B] font-bold shrink-0">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[9px] text-[#D1CEC7] font-mono mt-3 self-end">BLOCK 08</span>
        </div>

        {/* Block 9: Revenue Streams */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-1 border border-[#D1CEC7] p-3.5 bg-[#F4F9F4] flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-2 border-b border-emerald-200 pb-1.5">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="font-serif text-[12px]">수익 유형 및 매출원 <span className="font-sans font-normal text-[10px] text-emerald-600">(Revenue Streams)</span></span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-emerald-950 leading-relaxed">
              {revenues.map((r, idx) => (
                <li key={idx} className="flex gap-1 items-start">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[9px] text-emerald-300 font-mono mt-3 self-end">BLOCK 09</span>
        </div>

      </div>

      {/* Editorial stamp guidelines */}
      <div className="bg-[#FEF9E7] border border-amber-300 p-3 rounded-sm text-[11px] text-slate-800 italic leading-relaxed">
        <strong>💡 시니어 창업 자가 점검 (BMC 활용법):</strong> 9개 블록 전체가 유기적으로 작동해야 비즈니스가 붕괴하지 않습니다. 예컨대 **[핵심 활동]**을 가동하는 데 드는 월 고정비가 **[수익원]**에서 유입되는 정기 월 수수료 수준보다 과해지거나, **[핵심 자원]**에 해당하는 시니어의 노하우가 **[고객관계]**에 제대로 공급되지 않는 불균형이 발견되면, 우측 피드백 챗봇에 즉시 지시하여 완충 구조를 보완해 나가십시오.
      </div>
    </div>
  );
}
