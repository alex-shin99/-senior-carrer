import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  User, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Compass, 
  MapPin, 
  ShieldAlert, 
  CheckCircle,
  MessageSquare,
  Send,
  RefreshCw,
  Printer,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Award,
  Plus,
  ExternalLink
} from "lucide-react";
import { 
  CareerProfile, 
  ProposalDraft, 
  InterviewQuestion, 
  InterviewAnswer, 
  FirstReport, 
  ChatMessage 
} from "./types";
import BusinessModelCanvas from "./components/BusinessModelCanvas";
import RevenueSimulator from "./components/RevenueSimulator";
import MarketGrowthChart from "./components/MarketGrowthChart";
import InteractiveTimeline from "./components/InteractiveTimeline";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

// 1-Click presets targeted for 40~60 age domain specialists
const PRESETS = [
  {
    name: "25년 전문 IT 제조 대기업 공장장 (54세)",
    profile: {
      age: "50대",
      years: "25년",
      field: "제조 대기업 생산 관리 및 스마트 공정 고도화 솔루션 기획",
      strengths: "안전 규격 준수 역량, 글로벌 생산라인 최적화 네트워크보유, 중소 제조업체 실무 컨설팅 경력",
      idea: "오래된 중소형 제조 공장 대상 IoT 기반 스마트 팩토리 사후 관리 및 밀착형 유지보수 구독 서비스",
      target: "경기/인천 수도권 소재 30인 이하 하청 가공제조 생산 공장들"
    }
  },
  {
    name: "30년 금융기관 자산운용 및 리스크 관리 전문가 (61세)",
    profile: {
      age: "60대",
      years: "30년",
      field: "시중 은행 자산운용 및 리스크 사후평가팀 팀장",
      strengths: "정밀한 자산 포트폴리오 다각화, 금융 사기 분석, 법인 소유주 대상 금융 설계 노하우",
      idea: "1인 지식 기업가 및 은퇴 예정 중장년층을 위한 리스크 관리 중심 자산 보호 및 은퇴 가이드 1:1 오프라인 매니지먼트 아카데미",
      target: "금융 이탈 및 사기 위험에 고스란히 노출된 5060 고자산 은퇴 예정자들"
    }
  },
  {
    name: "20년 유명 프랜차이즈 외식업 본사 영업 본부장 (48세)",
    profile: {
      age: "40대",
      years: "20년",
      field: "국내 대형 외식 프랜차이즈 직영점 구축 및 가맹점 영업 관리 총괄",
      strengths: "상권 세부 분석 시스템 설계, 레시피 대중화 컨설팅, 원재료 대량 구매 유통 라인 지식",
      idea: "밀키트 출시 소상공인을 위한 상권 연계 및 식재료 통합 유통 구조 개선 솔루션과 가맹점 확장 컨설팅",
      target: "백화점 전용 로컬 외식 맛집 소상공인 및 소자본 창업 지원자"
    }
  }
];

export const HEADLINE_PRESETS = [
  {
    title: "대표님께서 평생 쌓아오신 현장의 연륜을 독보적인 비즈니스로 환치합니다",
    description: "수십 년간 직무에서 몸소 축적해온 도메인 전문 지식과 탄탄한 업계 네트워크를 시장이 신뢰하는 정량적 기획 뼈대로 치환합니다.",
    tag: "정교함과 전문성"
  },
  {
    title: "대표님의 깊은 현장 경험은 이미 온전히 갖추어진 가장 강력한 사업 자산입니다",
    description: "평생 현장을 지켜내며 몸으로 실증해낸 암묵지(Tacit Knowledge)와 핵심 노하우를 시장이 한눈에 파악하는 고부가가치 사업 모델로 리브랜딩합니다.",
    tag: "안정과 신뢰"
  },
  {
    title: "대표님이 지니신 수십 년의 지혜와 통찰을 지속가능한 비즈니스 형태로 완성합니다",
    description: "일시적인 유행을 타는 가벼운 실전 방식을 넘어, 대표님의 단단한 연륜이 검증해가는 실행 안정성을 바탕으로 탄탄한 지속성장형 사업을 구조화합니다.",
    tag: "가치와 통찰"
  },
  {
    title: "대표님 머릿속 직관적인 구상과 전문 지식을 완벽한 비즈니스 성과물로 입증합니다",
    description: "현업 전문성은 뚜렷하지만 도큐멘테이션에 애를 먹었던 대표님의 핵심 노하우를 냉철한 리스크 진단과 시각화된 비즈니스 캔버스로 완벽히 구조화합니다.",
    tag: "실전 마켓 중심"
  }
];

export default function App() {
  const [view, setView] = useState<"intro_ad" | "landing" | "app">(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("skip_intro_ad") === "true") {
        return "app";
      }
    }
    return "intro_ad";
  });
  const [autoSkipFuture, setAutoSkipFuture] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("skip_intro_ad") === "true";
    }
    return false;
  });

  const [transitionState, setTransitionState] = useState<{
    isTransitioning: boolean;
    toView: "intro_ad" | "landing" | "app" | null;
    opacity: number;
  }>({
    isTransitioning: false,
    toView: null,
    opacity: 0,
  });

  const changeViewWithFade = (newView: "intro_ad" | "landing" | "app") => {
    if (transitionState.isTransitioning) return;
    
    // Start transition
    setTransitionState({
      isTransitioning: true,
      toView: newView,
      opacity: 0,
    });
    
    // Fade in black overlay
    setTimeout(() => {
      setTransitionState(prev => ({ ...prev, opacity: 1 }));
    }, 50);

    // Swap view at peak blackness (400ms duration)
    setTimeout(() => {
      setView(newView);
      setTransitionState(prev => ({ ...prev, opacity: 1 }));
      
      // Let it wait a brief moment for the browser to render the new page, then fade out
      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, opacity: 0 }));
        
        // Completely finish transition
        setTimeout(() => {
          setTransitionState({
            isTransitioning: false,
            toView: null,
            opacity: 0,
          });
        }, 400);
      }, 100);
    }, 400);
  };

  const handleToggleAutoSkip = (val: boolean) => {
    setAutoSkipFuture(val);
    if (typeof window !== "undefined") {
      if (val) {
        localStorage.setItem("skip_intro_ad", "true");
      } else {
        localStorage.removeItem("skip_intro_ad");
      }
    }
  };

  const [adTimeLeft, setAdTimeLeft] = useState<number>(10);
  const [step, setStep] = useState<number>(1);
  const [headlineIdx, setHeadlineIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");

  useEffect(() => {
    if (view !== "intro_ad") return;
    
    setAdTimeLeft(10);
    const interval = setInterval(() => {
      setAdTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          changeViewWithFade("landing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [view]);

  // Step 1: Career Profile
  const [profile, setProfile] = useState<CareerProfile>({
    age: "50대",
    years: "20년",
    field: "",
    strengths: "",
    idea: "",
    target: ""
  });

  // Step 1 Output
  const [draft, setDraft] = useState<ProposalDraft | null>(null);

  // Step 2: Deep Interview Questions
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  // Store user answers
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  // Step 3: Analytical Report
  const [report, setReport] = useState<FirstReport | null>(null);
  const [reportTab, setReportTab] = useState<"report" | "canvas">("report");

  // Step 4: Finalize & Chatbot Revision
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userMsg, setUserMsg] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load Preset
  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setProfile(preset.profile);
    // clear subsequent states for safety
    setDraft(null);
    setQuestions([]);
    setAnswers({});
    setReport(null);
    setStep(1);
  };

  // Scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Handle Step 1 API Call: Generate Draft
  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.field || !profile.idea || !profile.strengths) {
      alert("경력 분야, 강점, 사업 아이디어는 꼭 입력해 주세요.");
      return;
    }

    setLoading(true);
    setLoadingMsg("선생님의 찬란한 실무 연륜을 녹여내어 가장 강력하고 신뢰성 높은 사업 제안서 초안 구조를 직조하고 있습니다...");
    try {
      const res = await fetch("/api/proposal/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerProfile: profile })
      });
      if (!res.ok) throw new Error("초안 생성 호출 실패");
      const data = await res.json();
      setDraft(data);

      // Instantly call Step 2 backend API as well, to prepare the customized questions
      setLoadingMsg("작성된 제안 초안을 토대로, 시니어 창업 시 마주할 칼날 같은 비용/시장 리스크를 지적하는 '초정밀 심층 질문 3가지'를 추출하는 중입니다...");
      const qRes = await fetch("/api/proposal/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerProfile: profile, draft: data })
      });
      if (!qRes.ok) throw new Error("심층 면접 질문 생성 실패");
      const qData = await qRes.json();
      setQuestions(qData.questions || []);

      // initialize answers with empty values or prefill helper options
      const tempAns: { [key: number]: string } = {};
      qData.questions.forEach((q: any) => {
        tempAns[q.id] = "";
      });
      setAnswers(tempAns);

      setStep(2);
    } catch (err: any) {
      console.error(err);
      alert("서버 통신 중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  // Skip / Quick Fill Answers for quick testing but preserving the rigorous API structure
  const handleQuickAnswerFill = () => {
    if (questions.length === 0) return;
    const prefilled: { [key: number]: string } = {};
    questions.forEach(q => {
      // Pick first suggested option as a preset response
      prefilled[q.id] = q.suggestedOptions && q.suggestedOptions[0] 
        ? `[추천 옵션 채택]: ${q.suggestedOptions[0]}` 
        : "제 삼십년 영업 지인들과 중장년 사업 네트워크를 동원해서 실무적으로 대응책을 만들 예정입니다.";
    });
    setAnswers(prefilled);
  };

  // Handle Step 2 API Call: Generate 1st Report
  const handleGenerateReport = async () => {
    // Check if all questions are answered
    const unanswered = questions.some(q => !answers[q.id] || answers[q.id].trim().length < 5);
    if (unanswered) {
      alert("각 질문에 최소 5글자 이상의 진정성 있는 답변을 적거나 아래의 '가이드 답변 빠른 적용' 버튼을 눌러 채워주세요.");
      return;
    }

    setLoading(true);
    setLoadingMsg("선생님의 솔직한 인터뷰 답변과 글로벌 시장 트렌드를 접목하여, '리스크/수익모델/투자비용'을 극도로 냉철하게 대입한 McKinsey급 리서치 분석 보고서를 편제하고 있습니다...");
    
    // Map answer object to analytical format
    const mappedAnswers = questions.map(q => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id]
    }));

    try {
      const res = await fetch("/api/proposal/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerProfile: profile,
          draft: draft,
          interviewAnswers: mappedAnswers
        })
      });
      if (!res.ok) throw new Error("1차 보고서 분석 생성 실패");
      const data = await res.json();
      setReport(data);

      // Prepopulate Chat history
      setChatHistory([
        {
          id: "welcome",
          role: "assistant",
          text: `안녕하세요 ${profile.years}의 화려한 연륜을 가진 시니어 대표님! 대표님의 누적 전문 경험과 인터뷰 답변을 종합 리서치하여 **[${data.title}]** 1차 전문 분석 보고서를 생성했습니다.

왼쪽 패널에 제공되는 점수표, 비용 산출서, 경쟁사 격파 전략, 로드맵을 천천히 자세히 읽어봐주십시오.

"초기 임대 비용이 너무 세니 낮춰줘", "마케팅 전략을 온라인 중심으로 추가해 줘", "경쟁사 약점을 내 노하우로 치고 들어가는 부분을 수정해 줘" 등 무엇이든 말씀하시면 제가 즉시 **보고서 도표 데이터와 전략 원문을 실시간 업데이트** 시켜드리겠습니다! 수정할 방향을 아래 챗에 입력해주세요.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setStep(3);
    } catch (err) {
      console.error(err);
      alert("보고서 생성 중 문제가 발생해 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 Chat Refining Response
  const handleChatInstruction = async (instructionText?: string) => {
    const textToSend = instructionText || userMsg;
    if (!textToSend.trim()) return;

    // Show on chat instantly
    const userChatId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userChatId,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newUserMsg]);
    if (!instructionText) {
      setUserMsg("");
    }

    setLoading(true);
    setLoadingMsg("AI 경영 파트너가 대표님의 피드백을 실시간 경청하여 시장 보고서의 데이터 세트, 비용 정산서, 성장 로드맵을 정교하게 고치고 있습니다...");

    try {
      // Map current questions & answers format
      const mappedAnswers = questions.map(q => ({
        id: q.id,
        question: q.question,
        answer: answers[q.id]
      }));

      const res = await fetch("/api/proposal/chat-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerProfile: profile,
          report: report, // current report of step 3
          chatHistory: chatHistory.slice(-6).map(c => ({ role: c.role, text: c.text })), // recent context
          userInstruction: textToSend
        })
      });

      if (!res.ok) throw new Error("채팅 조율 업데이트 실패");
      const data = await res.json();
      
      // Update interactive Report Object with the freshly restructured version!
      if (data.updatedReport) {
        setReport(data.updatedReport);
      }

      // Append Bot response
      const botChatId = `bot-${Date.now()}`;
      const newBotMsg: ChatMessage = {
        id: botChatId,
        role: "assistant",
        text: data.chatReply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, newBotMsg]);

      // Scroll with a tiny delay
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (err) {
      console.error(err);
      alert("협업 조율 지시 처리 중 오류가 생겼습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (view === "intro_ad") {
    return (
      <div id="ad-root" className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative select-none overflow-hidden uppercase">
        {/* Background photo-realistic cinematic video container */}
        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
          <img 
            src="/src/assets/images/cinematic_office_ad_1781756772945.jpg" 
            alt="Cinematic Executive Desk" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
            style={{
              transform: `scale(${1.15 - (adTimeLeft * 0.015)}) translate(${(10 - adTimeLeft) * 1.2}px, ${(10 - adTimeLeft) * -0.5}px)`,
              transition: "transform 1000ms ease-out"
            }}
          />
          
          {/* Radial vignette for high-end cinematic dim dark styling around corners */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle, transparent 35%, rgba(0,0,0,0.92) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80 pointer-events-none" />
          
          {/* Technical scanning overlays/scope markings to look hyper realistic */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute inset-10 border border-white/5 pointer-events-none rounded-sm" />
        </div>

        {/* Top Header: REC & UHD label */}
        <div className="absolute top-6 left-6 md:left-12 flex items-center gap-3 text-xs tracking-widest font-mono text-white/80 z-30">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> 
            REC 00:00:0{10 - adTimeLeft}
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/60">4K DCI HDR</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/50 font-semibold hidden sm:inline">SH社 BI-PRO FILM SEC_A</span>
        </div>

        {/* Top Right Limit indicator: time left */}
        <div className="absolute top-6 right-6 md:right-12 bg-black/60 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs font-mono tracking-widest text-white/95 z-35 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>광고 상영 중: {adTimeLeft}초 남음</span>
        </div>

        {/* Big Center Display Title Overlay - extremely subtle & high-end */}
        <div className="text-center z-25 max-w-4xl space-y-4 px-6 mb-24 pointer-events-none">
          <p className="text-[#E67E22] text-xs md:text-sm font-semibold tracking-[0.25em] uppercase animate-pulse">BizPro Architect Special Film</p>
          <h1 className="font-serif italic text-3xl md:text-5xl text-white font-bold leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            경험, 비즈니스가 되다
          </h1>
        </div>

        {/* Bottom Subtitle Section */}
        <div className="absolute bottom-16 left-6 right-6 text-center z-30 pointer-events-none px-4 max-w-3xl mx-auto min-h-[4.5rem] flex items-center justify-center">
          <p className="font-serif italic text-lg md:text-2xl text-white font-semibold tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] leading-relaxed transition-all duration-500 break-keep">
            {adTimeLeft > 7 && "“대표님께서 평생 현장에서 축적해 오신 존엄한 경력과 노하우...”"}
            {adTimeLeft <= 7 && adTimeLeft > 4 && "“단순한 은퇴로 묵혀두기엔 세상을 바꿀 너무나 위대한 지혜의 자원입니다.”"}
            {adTimeLeft <= 4 && adTimeLeft > 1 && "“이제 AI BizPro Architect와 만나 시장이 신뢰하는 정밀 비즈니스 기획서로 연성됩니다.”"}
            {adTimeLeft <= 1 && "“대표님의 두 번째 영광의 커리어 전성기가 지금, 완벽히 시작됩니다.”"}
          </p>
        </div>

        {/* Dolby Audio dynamic bouncing equalizer */}
        <div className="absolute bottom-6 left-6 md:left-12 flex items-end gap-1.5 h-8 z-30 opacity-75 hidden sm:flex">
          {[...Array(9)].map((_, i) => {
            const delays = [100, 300, 200, 400, 150, 350, 250, 500, 450];
            return (
              <div 
                key={i} 
                className="w-[3px] bg-[#E67E22] rounded-xs animate-pulse" 
                style={{ 
                  animationDuration: "800ms", 
                  animationDelay: `${delays[i]}ms`,
                  height: `${12 + (delays[i] % 18)}px`
                }} 
              />
            );
          })}
          <span className="text-[9px] text-white/50 font-mono tracking-wider ml-1">AI DOLBY ATMOS DIGITAL SOUND</span>
        </div>

        {/* Improved transition control deck */}
        <div className="absolute bottom-6 sm:bottom-10 right-6 md:right-12 z-40 flex flex-col items-stretch sm:items-end gap-3 max-w-sm w-full sm:w-auto">
          {/* Quick skip directly into core application */}
          <button
            type="button"
            onClick={() => {
              changeViewWithFade("app");
            }}
            className="w-full sm:w-auto bg-[#E67E22] hover:bg-[#d57018] text-white text-[12px] font-bold px-5 py-3.5 transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(230,126,34,0.45)] hover:shadow-[0_0_30px_rgba(230,126,34,0.65)] tracking-widest hover:scale-[1.03] active:scale-95 text-white font-sans uppercase border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>메인 진단기 즉시 실행 (빠른시작)</span>
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Quick skip to landing index & persistent setup */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full justify-end">
            <button
              type="button"
              onClick={() => {
                changeViewWithFade("landing");
              }}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-medium border border-white/20 px-3.5 py-2 transition-all rounded-xs flex items-center justify-center gap-1 cursor-pointer tracking-wider hover:text-white"
            >
              <span>상세 소개 홈(인덱스) 이동</span>
            </button>

            {/* Do not show again next time checkpoint */}
            <label className="flex items-center gap-2 cursor-pointer bg-black/60 border border-white/10 rounded-xs px-3 py-2 text-[10px] text-white/80 select-none hover:bg-black/80 transition-colors w-full sm:w-auto justify-center">
              <input
                type="checkbox"
                checked={autoSkipFuture}
                onChange={(e) => handleToggleAutoSkip(e.target.checked)}
                className="rounded-xs border-white/25 bg-black/40 text-[#E67E22] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-[#E67E22]"
              />
              <span className="whitespace-nowrap">앞으로 광고 숨기기 (대시보드 직행)</span>
            </label>
          </div>
        </div>

        {/* Extra Bottom Film spec overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/30 tracking-[0.2em] font-mono hidden md:block">
          CAMERA ARRI ALEXA LF • LENS PANAVISION PRIMO ANAMORPHIC
        </div>

        {/* Cinematic Fade Transition Overlay */}
        {transitionState.isTransitioning && (
          <div 
            className="fixed inset-0 bg-black z-[9999] pointer-events-none transition-opacity duration-300"
            style={{ opacity: transitionState.opacity }}
          />
        )}
      </div>
    );
  }

  if (view === "landing") {
    return (
      <div id="landing-root" className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans flex flex-col md:max-w-full overflow-x-hidden relative">
        {/* Navigation bar of landing */}
        <header className="h-18 border-b border-[#D1CEC7] bg-white flex items-center justify-between px-6 md:px-12 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2C3E50] flex items-center justify-center text-white font-serif italic text-xl font-bold rounded-xs">社</div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-[#2C3E50]/70 font-semibold block">Senior Business Proposal Engine</span>
              <span className="font-serif italic text-base md:text-lg tracking-tight font-bold">BizPro Architect <span className="font-sans text-[10px] bg-[#E67E22] text-white px-1.5 py-0.5 rounded ml-1 font-normal">정밀 시뮬레이터</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeViewWithFade("intro_ad")}
              className="text-xs text-[#706C61] hover:text-[#2C3E50] font-medium border-b border-dashed border-[#D1CEC7] hover:border-[#2C3E50] transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#E67E22] animate-spin" style={{ animationDuration: "5s" }} />
              시네마틱 광고 다시보기
            </button>
            <button
              onClick={() => changeViewWithFade("app")}
              className="bg-[#2C3E50] text-[#F9F8F6] hover:bg-black font-semibold text-xs py-2 px-4 rounded-xs transition-all shadow-xs flex items-center gap-1"
            >
              종합 진단기 기동 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Hero Banner Area */}
        <section className="bg-white border-b border-[#D1CEC7] py-14 md:py-20 px-6 md:px-12 relative overflow-hidden">
          {/* Subtle decoration elements */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#FAF1EC] rounded-full filter blur-3xl opacity-60 -z-10 pointer-events-none" />
          <div className="absolute left-10 bottom-0 w-64 h-64 bg-[#F4F9F4] rounded-full filter blur-3xl opacity-50 -z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF1EC] border border-[#E5D2C2] rounded-full text-[11px] text-[#E67E22] font-semibold tracking-wider uppercase">
                <Award className="w-3.5 h-3.5" /> 은퇴 예정 베테랑 리더 전용 비즈니스 자산화
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-[54px] leading-tight text-[#1A1A1A] font-bold tracking-tight">
                대표님의 평생의 경험과 직관을<br />
                대기 중인 <span className="underline decoration-[#E67E22] decoration-4 underline-offset-4">초격차 명품 비즈니스 모델</span>로 완성합니다.
              </h1>
              <p className="text-sm md:text-base text-[#706C61] font-serif italic leading-relaxed max-w-3xl">
                유행을 좇는 식상한 창업 설계가 아닙니다. 수십 년간 축적해오신 특정 산업군의 전문 지식, 인맥, 현장 기술을 냉정하고 입증 가능한 비용 분석 솔루션과 9개 블록 비즈니스 캔버스(BMC)로 정밀하게 치환합니다.
              </p>
            </div>

            {/* Massive Call-to-Action Action Board with high visual polish */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => changeViewWithFade("app")}
                className="group bg-[#2C3E50] text-[#F9F8F6] px-8 py-5 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-lg rounded-xs flex items-center justify-center gap-3 overflow-hidden text-center"
              >
                <span>나만의 비즈니스 설계 자문단 가동하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <div className="flex items-center gap-2 justify-center text-xs text-[#706C61] sm:pl-2">
                <CheckCircle className="w-4 h-4 text-[#E67E22]" />
                <span>가입 불필요, 3단계 즉석 진단 및 한글 제안서 즉시 완비</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Map 3 Grid Pillars */}
        <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#E67E22]">ENGINE PIPELINE</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#2C3E50]">BizPro Architect가 기동하는 전문 3가지 국면</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="border border-[#D1CEC7] p-6 bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xs bg-[#FAF1EC] flex items-center justify-center text-[#E67E22] font-serif font-bold text-lg">01</div>
                <h3 className="font-bold text-base text-[#2C3E50] flex items-center gap-1.5">
                  <Briefcase className="w-4.5 h-4.5 text-[#E67E22]" />경력 연륜 정밀 매칭
                </h3>
                <p className="text-xs text-[#706C61] leading-relaxed">
                  대표님의 특정 업계 경력 기간과 전문 분야, 직무 기술을 정밀 정량화하여 가장 리스크가 적으면서 고부가가치를 확보하는 은퇴 창업의 뼈대 설계도를 초안으로 도출해 냅니다.
                </p>
              </div>
              <span className="text-[10px] text-[#D1CEC7] font-mono tracking-widest block pt-2 border-t border-dashed border-[#D1CEC7]/70">REAL-TIME MATCHING</span>
            </div>

            {/* Pillar 2 */}
            <div className="border border-[#D1CEC7] p-6 bg-[#FAFBFB] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xs bg-emerald-50 flex items-center justify-center text-emerald-800 font-serif font-bold text-lg">02</div>
                <h3 className="font-bold text-base text-[#2C3E50] flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-700" />심층 뼈대 정밀 인터뷰
                </h3>
                <p className="text-xs text-[#706C61] leading-relaxed">
                  단방향 질문에 답하는 번거로움 없이, AI 아키텍트가 대표님의 초안을 기초로 해 목표 타겟 세그먼트, 고용 계획, 점포 입지 등 맞춤 리스크 극복용 핀셋 질문을 돌려 드립니다.
                </p>
              </div>
              <span className="text-[10px] text-[#D1CEC7] font-mono tracking-widest block pt-2 border-t border-dashed border-[#D1CEC7]/70">DEDICATED QUESTIONING</span>
            </div>

            {/* Pillar 3 */}
            <div className="border border-[#D1CEC7] p-6 bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xs bg-slate-100 flex items-center justify-center text-slate-800 font-serif font-bold text-lg">03</div>
                <h3 className="font-bold text-base text-[#2C3E50] flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-slate-700" />종합 시장 기획서 발간
                </h3>
                <p className="text-xs text-[#706C61] leading-relaxed">
                  도출된 통계 데이터에 기반한 다차원 강점 분석 레이더 차트, 현실적 초기 점포 보증금 및 월세 정액 비용 계산 시뮬레이터, 그리고 7조 6천억 거대 시니어 솔루션 마켓 예측 성장지 지표가 즉시 개설됩니다.
                </p>
              </div>
              <span className="text-[10px] text-[#D1CEC7] font-mono tracking-widest block pt-2 border-t border-dashed border-[#D1CEC7]/70">COMPREHENSIVE PRINT</span>
            </div>
          </div>
        </section>

        {/* Senior Professional Trust Grid Stats (Bento Visual Format) */}
        <section className="bg-[#F1F0EC] border-t border-b border-[#D1CEC7]/70 py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#E67E22] block">Market Proof & Trust</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                왜 "시니어 경력의 비즈니스화" 인가?
              </h2>
              <p className="text-xs md:text-sm text-[#706C61]">시장의 명확한 지각과 통계가 시니어 리더십과 현장 전문지식의 성공률을 입증하고 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="md:col-span-2 border border-[#D1CEC7] bg-white p-6 justify-between flex flex-col min-h-[160px] rounded-xs" style={{ contentVisibility: 'auto' }}>
                <span className="text-[9px] text-[#D1CEC7] font-mono block">STATISTIC 01</span>
                <div>
                  <h4 className="font-serif text-3xl font-bold text-[#E67E22]">2.2배</h4>
                  <p className="font-bold mt-1 text-slate-800">미국 중소기업청(SBA) 검증 창업 성공 비율</p>
                  <p className="text-[11px] text-[#706C61] mt-1">50대 이상 시니어 창업자의 5년 이상 사업 생존 및 안정화 확률은 20대 창업자에 비해 2.2배 이상 압도적인 우위를 점합니다.</p>
                </div>
              </div>

              <div className="border border-[#D1CEC7] bg-white p-6 justify-between flex flex-col min-h-[160px] rounded-xs" style={{ contentVisibility: 'auto' }}>
                <span className="text-[9px] text-[#D1CEC7] font-mono block">STATISTIC 02</span>
                <div>
                  <h4 className="font-serif text-3xl font-bold text-[#2C3E50]">9개</h4>
                  <p className="font-bold mt-1 text-slate-800">9-Block BMC 캔버스</p>
                  <p className="text-[11px] text-[#706C61] mt-1">글로벌 검증 비즈니스 프레임워크로 핵심 파트너와 수익모델을 입체 정렬합니다.</p>
                </div>
              </div>

              <div className="border border-[#D1CEC7] bg-white p-6 justify-between flex flex-col min-h-[160px] rounded-xs" style={{ contentVisibility: 'auto' }}>
                <span className="text-[9px] text-[#D1CEC7] font-mono block">STATISTIC 03</span>
                <div>
                  <h4 className="font-serif text-3xl font-bold text-slate-800">0원</h4>
                  <p className="font-bold mt-1 text-slate-800">도입 설계 무상</p>
                  <p className="text-[11px] text-[#706C61] mt-1">사전 컨설팅 비용 필요 없이, 축적된 경력만으로 즉각 활용가능한 1차 기획 시뮬레이터 배포.</p>
                </div>
              </div>
            </div>

            {/* Bottom Slogan CTA layout */}
            <div className="text-center pt-8 border-t border-[#D1CEC7]/50 space-y-4">
              <p className="text-xs text-[#706C61] font-serif italic">
                "성공의 기회는 흐릿한 희망이 아닌, 준비된 자가 평생 일구어 낸 경험의 견고함에서 탄생합니다."
              </p>
              <button
                onClick={() => changeViewWithFade("app")}
                className="inline-flex items-center gap-2 bg-[#2C3E50] hover:bg-black text-[13px] tracking-widest font-bold text-white px-8 py-4 uppercase border border-transparent hover:border-[#E67E22] duration-200 cursor-pointer"
              >
                지금 첫 기획안 무료 생성하기 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer className="h-16 bg-[#2C3E50] text-white text-[10px] px-6 md:px-12 flex items-center justify-between shrink-0 border-t border-[#1C2833]">
          <div>PROJECT ID: BIZ_SENIOR_ACT_2026</div>
          <div className="opacity-65">© 2026 BIZPRO ARCHITECT AI SYSTEM. ALL RIGHTS RESERVED.</div>
          <button
            onClick={() => changeViewWithFade("intro_ad")}
            className="hover:text-[#E67E22] cursor-pointer transition-colors"
          >
            시네마틱 영상 ad 다시보기
          </button>
        </footer>

        {/* Cinematic Fade Transition Overlay */}
        {transitionState.isTransitioning && (
          <div 
            className="fixed inset-0 bg-black z-[9999] pointer-events-none transition-opacity duration-300"
            style={{ opacity: transitionState.opacity }}
          />
        )}
      </div>
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans flex flex-col md:max-w-full overflow-x-hidden">
      
      {/* Editorial Navigation Header */}
      <header className="min-h-18 h-auto md:h-auto lg:h-18 border-b border-[#D1CEC7] bg-white flex flex-col md:flex-row items-center justify-between px-4 py-3 md:py-2.5 lg:py-0 shrink-0 gap-3 md:gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#2C3E50] flex items-center justify-center text-white font-serif italic text-xl font-bold rounded-xs shrink-0">社</div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#2C3E50]/70 font-semibold block whitespace-nowrap">Senior Business Proposal Engine</span>
            <span className="font-serif italic text-base sm:text-lg tracking-tight font-bold whitespace-nowrap">BizPro Architect <span className="font-sans text-[10px] not-italic bg-[#2C3E50] text-[#F9F8F6] px-1 py-0.5 rounded ml-1 font-normal">시니어 전문</span></span>
          </div>
        </div>

        {/* Dynamic Nav Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4 text-xs">
          <div className={`flex items-center gap-1 sm:gap-1.5 ${step === 1 ? 'border-b-2 border-[#2C3E50] pb-1 font-bold' : 'opacity-40 font-medium'}`}>
            <span className="w-4 h-4 rounded-full bg-[#2C3E50] text-white text-[9px] flex items-center justify-center font-bold shrink-0">1</span>
            <span className="whitespace-nowrap text-[10px] sm:text-xs">경력/초안</span>
          </div>
          <div className="hidden sm:block w-2 md:w-3 lg:w-4 h-[1px] bg-[#D1CEC7] shrink-0"></div>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${step === 2 ? 'border-b-2 border-[#2C3E50] pb-1 font-bold' : 'opacity-40 font-medium'}`}>
            <span className="w-4 h-4 rounded-full bg-[#2C3E50] text-white text-[9px] flex items-center justify-center font-bold shrink-0">2</span>
            <span className="whitespace-nowrap text-[10px] sm:text-xs">
              <span className="hidden xl:inline">심층 뼈대 인터뷰</span>
              <span className="inline xl:hidden">심층 인터뷰</span>
            </span>
          </div>
          <div className="hidden sm:block w-2 md:w-3 lg:w-4 h-[1px] bg-[#D1CEC7] shrink-0"></div>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${step >= 3 ? 'border-b-2 border-[#2C3E50] pb-1 font-bold' : 'opacity-40 font-medium'}`}>
            <span className="w-4 h-4 rounded-full bg-[#2C3E50] text-white text-[9px] flex items-center justify-center font-bold shrink-0">3</span>
            <span className="whitespace-nowrap text-[10px] sm:text-xs">
              <span className="hidden xl:inline">종합 시장보고서 & 챗 수정</span>
              <span className="inline xl:hidden">시장보고서 &amp; 챗</span>
            </span>
          </div>
        </div>

        {/* Improved header controls containing return link & persistent quick-dashboard switcher */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {step >= 3 && (
            <button 
              type="button"
              onClick={handlePrint}
              className="text-[11px] uppercase tracking-widest font-bold py-1.5 px-3 border border-[#2C3E50] cursor-pointer hover:bg-[#2C3E50] hover:text-white transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF/인쇄 내보내기</span>
              <span className="inline sm:hidden">인쇄</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => changeViewWithFade("landing")}
            className="text-[10px] font-bold text-[#706C61] hover:text-[#2C3E50] bg-[#F1F0EC] hover:bg-[#E5E3DD] transition-all px-2.5 py-1.5 rounded-sm flex items-center gap-1 border border-[#D1CEC7]"
            title="소개 페이지로 돌아가기"
          >
            ← 소개홈
          </button>
          
          <label className="flex items-center gap-1.5 cursor-pointer bg-white border border-[#D1CEC7] hover:border-[#2C3E50] rounded-xs px-2 py-1 text-[10px] text-[#555] select-none transition-colors">
            <input
              type="checkbox"
              checked={autoSkipFuture}
              onChange={(e) => handleToggleAutoSkip(e.target.checked)}
              className="rounded-xs border-gray-300 text-[#E67E22] focus:ring-0 w-3 h-3 cursor-pointer accent-[#E67E22]"
            />
            <span className="whitespace-nowrap font-medium text-[9px] sm:text-[10px]" title="다음에 실행할 때 광고 생략하고 즉시 기획서 대시보드로 이동">자동 빠른시작</span>
          </label>
        </div>
      </header>

      {/* Preset Fast Loader Banner */}
      {step === 1 && (
        <section className="bg-[#F1F0EC] border-b border-[#D1CEC7] px-6 py-3">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#2C3E50] text-white text-[10px] uppercase font-bold tracking-wider rounded-xs">Quick Demo</span>
              <p className="text-xs text-[#555] font-serif italic">시간이 없으시거나 입력을 테스트해보시려면 4060 은퇴자 맞춤형 프로필 템플릿을 선택해보세요:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadPreset(p)}
                  className="bg-white border border-[#D1CEC7] hover:border-[#2C3E50] text-[#2C3E50] hover:bg-[#F9F8F6] text-[10px] px-2.5 py-1 rounded transition-all font-medium text-left truncate max-w-[240px]"
                  title={p.name}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden bg-[#F9F8F6]">
        
        {/* =========================================================
            LEFT COLUMN : FLOW CONTENT / THE DRILL-DOWN ANALYSIS REPORT 
            ========================================================= */}
        <section id="main-report-workspace" className="col-span-12 lg:col-span-7 border-r border-[#D1CEC7] bg-white p-6 lg:p-10 overflow-y-auto h-auto lg:h-[calc(100vh-100px)]">
          
          {/* STEP 1: CAREER INPUT FORM & REAL-TIME ACCENTED PREVIEWS */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-[#D1CEC7] pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
                  <span className="text-[#2C3E50] font-bold text-xs uppercase tracking-[0.2em] block">Phase 01 . Professional Profile Matcher</span>
                  
                  {/* Copy switcher pills */}
                  <div className="flex flex-wrap gap-1 items-center bg-[#F1F0EC] p-0.5 rounded-sm">
                    {HEADLINE_PRESETS.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setHeadlineIdx(pIdx)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-xs transition-all ${
                          headlineIdx === pIdx 
                            ? "bg-[#2C3E50] text-[#F9F8F6]" 
                            : "text-[#706C61] hover:text-[#1A1A1A] hover:bg-[#FAFBFB]/55"
                        }`}
                        title={p.title}
                      >
                        {p.tag}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl leading-snug text-[#1A1A1A] font-semibold transition-all duration-300">
                  {HEADLINE_PRESETS[headlineIdx].title}
                </h2>
                <p className="text-[13px] leading-relaxed text-[#706C61] mt-2.5 font-serif italic transition-all duration-300">
                  {HEADLINE_PRESETS[headlineIdx].description}
                </p>
              </div>

              <form onSubmit={handleGenerateDraft} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-[#2C3E50]">신청자 연령대</label>
                    <select
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#D1CEC7] p-2 text-sm focus:outline-none focus:border-[#2C3E50]"
                    >
                      <option value="40대">40대 중후반 (전문 경력 절정기)</option>
                      <option value="50대">50대 (은퇴 예정 및 융합 전문가)</option>
                      <option value="60대">60대 이상 (마스터 실무 고문)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-[#2C3E50]">해당 도메인 경력 기간</label>
                    <select
                      value={profile.years}
                      onChange={(e) => setProfile({ ...profile, years: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#D1CEC7] p-2 text-sm focus:outline-none focus:border-[#2C3E50]"
                    >
                      <option value="15년">15년 안팎 (시니어 리더십 수립)</option>
                      <option value="20년">20년 (안정된 대형 도메인 구축)</option>
                      <option value="25년">25년 (최고 실무 마스터)</option>
                      <option value="30년 이상">30년 이상 (업계 자문위원 등급)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold mb-1 text-[#2C3E50] flex items-center justify-between">
                    <span>1. 지금까지 어떠한 산업/업무 경력을 쌓으셨습니까?</span>
                    <span className="text-[10px] text-red-650 font-normal">필수</span>
                  </label>
                  <textarea
                    rows={2}
                    value={profile.field}
                    onChange={(e) => setProfile({ ...profile, field: e.target.value })}
                    placeholder="예: 현대제철 협력 생산라인 총 책임자 25년으로 설비 유지 관리 및 안전 교육 전문가"
                    className="w-full bg-[#F9F8F6] border border-[#D1CEC7] p-3 text-sm focus:outline-none focus:border-[#2C3E50] rounded-xs"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">부서 정보나 실무에서 가장 자신 있었던 주특기 업무를 포함해 주시면 정밀한 분석이 추진됩니다.</p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold mb-1 text-[#2C3E50] flex items-center justify-between">
                    <span>2. 대표님만이 보유하신 실무 강점이나 인적 인프라, 특허 등은 무엇입니까?</span>
                    <span className="text-[10px] text-red-650 font-normal">필수</span>
                  </label>
                  <textarea
                    rows={2}
                    value={profile.strengths}
                    onChange={(e) => setProfile({ ...profile, strengths: e.target.value })}
                    placeholder="예: 제조업 사장단 모임 네트워크 보유, 시공사 안전관리 기준 융합, 관련 1급 기술자격증 보유"
                    className="w-full bg-[#F9F8F6] border border-[#D1CEC7] p-3 text-sm focus:outline-none focus:border-[#2C3E50] rounded-xs"
                    required
                  />
                </div>

                <div className="bg-[#F1F0EC] p-4 border-l-4 border-[#2C3E50] rounded-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50] flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    시니어 혁신 비즈니스 구상안
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 mb-1">관심 있는 창업 구상 / 아이디어</label>
                    <textarea
                      rows={2}
                      value={profile.idea}
                      onChange={(e) => setProfile({ ...profile, idea: e.target.value })}
                      placeholder="예: 신규 공장 오픈 시 환경 안전 규제 통과를 대행하고 위험 요소를 IoT 센서로 자동 감찰 및 사후 경고해주는 정기 위탁 컨설팅 서비스"
                      className="w-full bg-white border border-[#D1CEC7] p-3 text-sm focus:outline-none focus:border-[#2C3E50] rounded-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 mb-1">염두에 두신 본 비즈니스의 첫 번째 핵심 타겟층</label>
                    <input
                      type="text"
                      value={profile.target}
                      onChange={(e) => setProfile({ ...profile, target: e.target.value })}
                      placeholder="예: 경기도 안산/시흥 반월시화국가산업단지 내 중소 영세 자동차 도자기 부품공장 사장님들"
                      className="w-full bg-white border border-[#D1CEC7] p-2.5 text-sm focus:outline-none focus:border-[#2C3E50] rounded-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2C3E50] text-[#F9F8F6] hover:bg-[#1A252F] py-3.5 px-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xs shadow-sm"
                >
                  <span>은퇴연륜 맞춤형 사업계획서 초안 빌딩하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CUSTOM DEEP INTERVIEW QUESTIONS & RATIONALES */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-b border-[#D1CEC7] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[#2C3E50] font-bold text-xs uppercase tracking-[0.2em] mb-1 block">Phase 02 . Pre-Research Interview</span>
                  <h2 className="font-serif text-3xl leading-snug text-[#1A1A1A] font-semibold">1:1 검증형 심층 보완면접</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 font-bold uppercase rounded-sm">
                    현실 장벽 3대 악재 진단
                  </span>
                </div>
              </div>

              {/* Display Generated Draft Brief Panel to ground the interviewer */}
              {draft && (
                <div className="bg-[#F9F8F6] p-5 border border-[#D1CEC7] rounded-xs relative">
                  <span className="absolute top-3 right-4 text-[9px] uppercase tracking-wider bg-white text-[#2C3E50] px-2 py-0.5 border border-[#D1CEC7] font-semibold">Draft Core</span>
                  <p className="font-serif italic text-lg text-[#2C3E50] font-bold">" {draft.businessName} "</p>
                  <p className="text-[12px] opacity-80 mt-1 text-slate-700 leading-normal">{draft.summary}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#D1CEC7]/60 text-[11px] text-slate-800">
                    <div>
                      <span className="font-bold block color-[#2C3E50]">■ 창업 핵심가치 제안</span>
                      <p>{draft.uniqueValueProposition}</p>
                    </div>
                    <div>
                      <span className="font-bold block color-[#2C3E50]">■ 시니어 경력의 핵심 치환성</span>
                      <p>{draft.founderStrengths}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-[#FEF9E7] p-4 text-[12px] text-amber-900 border-l-4 border-amber-500 rounded-xs">
                  <strong>💡 시니어 대표님을 위한 면접 수칙:</strong> 본 질문은 중장년층이 퇴직 후 창업 시 가장 뼈아프게 겪는 **실패 리스크(고자본 투자, 초기 고정 임대료, 한정된 타겟 세일즈 채널)**를 미연에 걸러내기 위한 모의 스트레스 테스트입니다. 솔직하고 디테일하게 직접 입력하시거나, 각 질문 아래의 **'선택 가능 답변 가이드'**를 탭하여 대표님의 사업 상황에 맞게 융합 답변을 빠르게 채우실 수도 있습니다.
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="border border-[#D1CEC7] p-5 bg-white space-y-3 relative">
                    <div className="flex items-start gap-3">
                      <span className="font-serif italic text-2xl text-[#2C3E50] font-black">{idx + 1}.</span>
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1A1A1A] leading-snug">{q.question}</h4>
                        <p className="text-[11px] text-[#706C61] mt-1 leading-relaxed bg-[#F9F8F6] p-2 border-l border-[#2C3E50]">
                          <strong className="text-[10px] text-[#2C3E50] block uppercase tracking-wider">이 질문이 중요한 이유 (경영 자문단 지적)</strong>
                          {q.rationale}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-[#2C3E50]">기재할 계획적 답변</label>
                      <textarea
                        rows={3}
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        placeholder="이 문제를 해결하기 위한 조치를 구상하신 대로 자유롭게 입력해 주세요."
                        className="w-full bg-[#F9F8F6] border border-[#D1CEC7] p-3 text-xs focus:outline-none focus:border-[#2C3E50] focus:bg-white transition-all rounded-xs"
                      />
                    </div>

                    {/* Pre-suggested quick choice options */}
                    {q.suggestedOptions && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-semibold">▼ 가이드 예시 답변 중 하나를 택해 그대로 기입하거나 수정하기:</span>
                        <div className="flex flex-col gap-1.5">
                          {q.suggestedOptions.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                setAnswers({ ...answers, [q.id]: opt });
                              }}
                              className="text-left text-[11px] bg-[#F1F0EC] text-slate-800 p-2 border border-transparent hover:border-[#D1CEC7] hover:bg-white transition-all rounded-xs italic"
                            >
                              " {opt} "
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleQuickAnswerFill}
                  className="bg-white border border-[#2C3E50] text-[#2C3E50] hover:bg-[#F1F0EC] py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all rounded-xs"
                >
                  가이드 답변 전체 빠른 적용 (테스트용)
                </button>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="flex-1 bg-[#2C3E50] text-[#F9F8F6] hover:bg-black py-3.5 px-6 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xs"
                >
                  <span>인터뷰 완료 및 정밀 리서치 보고서 발행</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 & STEP 4: EDITORIAL HIGH-FIDELITY MARKET RESEARCH REPORT */}
          {step >= 3 && report && (
            <div id="printable-area" className="animate-fade-in space-y-8">
              
              {/* Report Header Metadata */}
              <div className="border-b-2 border-double border-[#D1CEC7] pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#706C61] border-b border-[#F0EFEA] pb-2 mb-4">
                  <span>정밀 기획 서재 v2.0 (Confidential)</span>
                  <span className="font-mono">DATE: 2026-06 PLANNER: BIZPRO ARCHITECT</span>
                </div>
                <span className="text-[#2C3E50] font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Enterprise Growth & Risk Audit Report</span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-semibold leading-tight">{report.title}</h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-[#F9F8F6] border border-[#E5E3DD] text-[11px]">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono">시니어 연령층</span>
                    <strong className="text-slate-800">{profile.age}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono">누적 마스터 경력</span>
                    <strong className="text-slate-800">{profile.years} ({profile.field.substring(0, 18)}...)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono">추천 비즈니스명</span>
                    <strong className="text-[#2C3E50]">{draft?.businessName || "제안 비즈니스"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono">상태 분석 모델</span>
                    <strong className="text-emerald-700">1차 분석 및 챗 협업 검정완료</strong>
                  </div>
                </div>
              </div>

              {/* Tabs for switching between Report and BMC */}
              <div className="flex border-b border-[#D1CEC7] gap-2 pb-0.5 select-none shrink-0 print:hidden overflow-x-auto scroller-none">
                <button
                  type="button"
                  onClick={() => setReportTab("report")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 whitespace-nowrap ${
                    reportTab === "report" 
                      ? "border-[#2C3E50] text-[#2C3E50]" 
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-[#F1F0EC]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <span className="hidden sm:inline">1차 정밀 세부 보고서 (Full Report)</span>
                    <span className="sm:hidden">세부 보고서 (Report)</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportTab("canvas")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 whitespace-nowrap ${
                    reportTab === "canvas" 
                      ? "border-[#2C3E50] text-[#2C3E50]" 
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-[#F1F0EC]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-amber-800">
                    <span className="hidden sm:inline">비즈니스 모델 캔버스 9개 블록 (BMC)</span>
                    <span className="sm:hidden">비즈니스 캔버스 (BMC)</span>
                  </span>
                </button>
              </div>

              {reportTab === "report" ? (
                <div className="space-y-8 animate-fade-in print:block">
                  {/* Research Executive Summary */}
                  <div className="space-y-3">
                    <h3 className="font-serif italic text-xl border-l-4 border-[#2C3E50] pl-3">Executive Summary (종합 종합평)</h3>
                    <p className="text-[13px] leading-relaxed text-[#2C3E50] font-serif bg-[#FBFBFA] p-5 border border-[#E5E3DD] italic whitespace-pre-line">
                      {report.executiveSummary}
                    </p>
                  </div>

                  {/* MULTI-METRIC RADAR & SCORE SECTION USING REAL GRAPHICS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Visual Chart 1: Market evaluation metrics bar diagram */}
                    <div className="border border-[#E5E3DD] p-4 bg-[#FBFBFA]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">GRAPH A / 시장 타당성 점수 진단 (100점 만점)</span>
                      <h4 className="font-serif font-bold text-sm text-slate-850 mb-3 block">사업화 세부 지표 분석 ({report.marketEvaluation.generalScore}점 획득)</h4>
                      
                      {/* High-contrast Custom Pure SVG Bars for solid look and feel */}
                      <div className="h-44 flex flex-col justify-between pt-2">
                        {report.marketEvaluation.radarMetrics.map((met, mIdx) => {
                          const percentage = Math.min(100, Math.max(0, met.value));
                          return (
                            <div key={mIdx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-800">
                                <span>{met.subject}</span>
                                <span className="font-mono">{percentage} 점</span>
                              </div>
                              <div className="w-full bg-[#EBE9E3] h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#2C3E50] h-full transition-all duration-500" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-[#F1F0EC] border-t border-[#D1CEC7] p-2.5 rounded-sm mt-3 text-[10px] text-slate-800 leading-relaxed">
                        <strong className="text-[#2C3E50] block">▼ 시장성 정밀 보고 진단 피드백</strong>
                        {report.marketEvaluation.radarFeedback}
                      </div>
                    </div>

                    {/* Score Summary List */}
                    <div className="border border-[#E5E3DD] p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">SCORE CARD</span>
                        <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">지표 평가 점수 상세 사유</h4>
                        <p className="text-[11px] text-slate-600 mt-1">연구원이 리스크를 감안해 혹독하게 책정한 부하별 개별 감점 사유입니다.</p>
                      </div>

                      <div className="space-y-2 mt-2">
                        {report.marketEvaluation.radarMetrics.map((met, mIdx) => (
                          <div key={mIdx} className="text-[11px] border-b border-[#F0EFEA] pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                              <strong className="text-slate-800 font-serif">{met.subject} : {met.value}점</strong>
                            </div>
                            <p className="text-slate-500 pl-3 leading-snug">{met.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* REALISTIC COST PROJECTION BREAKDOWN & TABLE */}
                  <div className="border border-[#E5E3DD] p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3DD] pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">COST ANALYSIS / 예산 소요 산정</span>
                        <h3 className="font-serif text-xl font-bold text-slate-900">예상 소요 초기 자본 분석</h3>
                      </div>
                      <div className="bg-[#2C3E50] text-[#F9F8F6] px-4 py-2 text-center rounded-xs">
                        <span className="text-[9px] block uppercase opacity-70">총 추정 불입액 (운영 예비금 포함)</span>
                        <strong className="text-base font-serif italic">{(report.costProjection.totalCostExcludingCapital).toLocaleString()} 만원</strong>
                      </div>
                    </div>

                    {/* Styled Table Grid like an audit ledger */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F1F0EC] text-[#2C3E50] font-bold border-y border-[#D1CEC7]">
                            <th className="py-2.5 px-3">카테고리 / 자산 명목</th>
                            <th className="py-2.5 px-3 text-right">예상 산정액</th>
                            <th className="py-2.5 px-3">상세 예산 근거 및 시니어 대응책</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E3DD]">
                          {report.costProjection.items.map((item, iIdx) => (
                            <tr key={iIdx} className="hover:bg-[#F9F8F6]/50">
                              <td className="py-3 px-3 font-semibold text-slate-800">{item.category}</td>
                              <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono text-xs whitespace-nowrap">
                                {item.amount.toLocaleString()} 만원
                              </td>
                              <td className="py-3 px-3 text-slate-600 leading-normal">{item.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-[#FEF9E7] border border-amber-300 p-3.5 rounded-sm text-[11px] text-amber-900 flex items-start gap-2.5">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>💸 시니어 자금 안정화 긴급 조언:</strong> {report.costProjection.costFeedback}
                      </div>
                    </div>
                  </div>

                  {/* REVENUE & PROFIT SCENARIO SIMULATOR PANEL */}
                  <RevenueSimulator report={report} />

                  {/* MARKET GROWTH 5-YEAR TREND LINE CHART (D3.JS) */}
                  <MarketGrowthChart report={report} />

                  {/* COMPETITOR DENSITY & CONQUER STRATEGY MATRIX */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">COMPETITIVE INTEL / 경쟁자 동향</span>
                      <h3 className="font-serif italic text-xl border-l-4 border-[#2C3E50] pl-3">주요 시장 경쟁군 분석 & 파괴적 격파 방안</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {report.competitorAnalysis.competitors.map((comp, cIdx) => (
                        <div key={cIdx} className="border border-[#E5E3DD] bg-white p-4 space-y-2.5">
                          <div className="flex justify-between items-center bg-[#F1F0EC] p-2 border-b border-[#D1CEC7]">
                            <strong className="text-xs text-[#2C3E50] font-serif">■ 경쟁 대표 그룹 : {comp.name}</strong>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">DIRECT THREAT</span>
                          </div>
                          
                          <div className="text-[11px] space-y-1.5 text-slate-700">
                            <div>
                              <strong className="text-slate-900 font-semibold block">경쟁자의 강점:</strong>
                              <p className="pl-2 border-l-2 border-slate-300">{comp.strength}</p>
                            </div>
                            <div>
                              <strong className="text-[#E74C3C] font-semibold block">경쟁자의 뼈아픈 약점:</strong>
                              <p className="pl-2 border-l-2 border-[#E74C3C]">{comp.weakness}</p>
                            </div>
                            <div className="bg-[#F4F9F4] p-2 border-l-2 border-[#27AE60] mt-1.5">
                              <strong className="text-[#27AE60] font-bold block">4060 연륜 기반 격파 방안 (시니어 돌파 장벽):</strong>
                              <p className="text-slate-800 italic font-serif">"{comp.howToBeat}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-[#F9F8F6] border border-[#D1CEC7] text-[11px] leading-relaxed text-slate-707">
                      <strong className="text-[#2C3E50] uppercase block tracking-wider mb-1">■ 경쟁사 보복 및 진입 마찰 위험 보고</strong>
                      {report.competitorAnalysis.threatAssessment}
                    </div>
                  </div>

                  {/* REVENUE MODEL & FINANCIAL STRATEGY */}
                  <div className="border border-[#D1CEC7] p-5 bg-[#FBFBFA] space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#2C3E50]" />
                      <h3 className="font-serif text-lg font-bold text-slate-950">수익 극대화 가격 정책 & 비즈니스 모델 (BM)</h3>
                    </div>
                    <p className="text-xs text-slate-755 leading-relaxed whitespace-pre-line bg-white p-4 border border-[#E5E3DD] font-serif">
                      {report.financialStrategy}
                    </p>
                  </div>

                  {/* REALISTIC 4-STAGE ROADMAP WITH DETAILED TEMPORAL TRACKS (INTERACTIVE TIMELINE) */}
                  <InteractiveTimeline report={report} />

                  {/* REAL HEALTH & OPERATIONAL HEALTH WARNINGS */}
                  <div className="bg-[#FDF1F0] border-l-4 border-[#E74C3C] p-5 space-y-2 rounded-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#E74C3C] flex items-center gap-1.5">
                      <ShieldAlert className="w-4.5 h-4.5" />
                      시니어 경영 가동 리스크 및 수명관리 경고 (Health & Financial Watch)
                    </h4>
                    <p className="text-[11px] leading-relaxed text-[#78281F] whitespace-pre-line font-serif">
                      {report.riskAssessment}
                    </p>
                  </div>

                  {/* SIMILAR FIELD SUCCESS STORIES */}
                  <div className="border border-[#E5E3DD] p-5 space-y-6 bg-[#FAF9F5]">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">CASE STUDIES / 유사 분야 실존 성공사례 (검색 검증)</span>
                      <h3 className="font-serif italic text-xl border-l-4 border-amber-600 pl-3">40~60대 은퇴자 연륜-경험 융합 창업사례 분석</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {report.successStories && report.successStories.length > 0 ? (
                        report.successStories.map((story, sIdx) => (
                          <div key={sIdx} className="border border-[#E5E3DD] bg-white p-4 flex flex-col justify-between space-y-3 shadow-xs">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between border-b border-[#F1F0EC] pb-2">
                                <span className="text-xs font-mono font-bold text-amber-800 bg-[#FEF9E7] px-2 py-0.5 rounded-sm">
                                  {story.ageAtLaunch} 창업
                                </span>
                                {story.sourceUrl && (
                                  <a 
                                    href={story.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-slate-400 hover:text-[#2C3E50] transition-colors"
                                    title="출처로 이동"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">
                                {story.companyName}
                                <span className="block text-xs font-sans font-medium text-slate-500 mt-0.5">({story.founderName})</span>
                              </h4>
                              <p className="text-[11px] leading-relaxed text-slate-600 font-serif">
                                {story.summary}
                              </p>
                            </div>
                            <div className="bg-[#FAF9F5] p-2.5 border-t border-[#F1F0EC] space-y-1 mt-auto">
                              <span className="text-[9px] uppercase font-bold text-amber-800 block">💡 성공 요인 (시니어 강점 매칭)</span>
                              <p className="text-[10px] leading-snug text-slate-705 italic font-serif">
                                "{story.keySuccessFactor}"
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-4 text-xs text-slate-500 font-serif">
                          실존 성공사례 데이터를 로딩하고 있거나 데이터를 찾지 못했습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in print:block">
                  <BusinessModelCanvas profile={profile} draft={draft} report={report} />
                </div>
              )}

              {/* Next Step / Restart trigger */}
              <div className="pt-6 border-t border-[#D1CEC7] flex justify-between items-center flex-wrap gap-4">
                <p className="text-[11px] text-slate-500 font-serif italic">BizPro Architect 정밀 시장분석 솔루션 v2.0</p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("새로운 프로필로 다시 정밀 세션을 시작하시겠습니까? 현재까지의 데이터는 지워집니다.")) {
                      setStep(1);
                      setDraft(null);
                      setQuestions([]);
                      setAnswers({});
                      setReport(null);
                      setChatHistory([]);
                    }
                  }}
                  className="bg-[#F1F0EC] hover:bg-[#D1CEC7] text-[#2C3E50] text-[10px] py-1.5 px-3 uppercase tracking-wider font-bold transition-all border border-[#D1CEC7]"
                >
                  기록 초기화 및 경력 재설정
                </button>
              </div>

            </div>
          )}

        </section>

        {/* =========================================================
            RIGHT COLUMN: INTERACTIVE AI CHAT CONTEXT & REFINING WORKSPACE
            ========================================================= */}
        <section className="col-span-12 lg:col-span-5 bg-[#F1F0EC] flex flex-col h-[650px] lg:h-[calc(100vh-100px)]">
          
          {/* Assistant Info panel */}
          <div className="p-4 border-b border-[#D1CEC7] bg-[#EBE9E3] shrink-0">
            <span className="text-[#2C3E50] font-bold text-[10px] uppercase tracking-[0.15em] mb-1 block">Analysis Companion / 실시간 개정 패널</span>
            <h3 className="font-serif italic text-base text-slate-900 font-bold flex items-center justify-between">
              <span>경영 기획 자문 위원 챗봇</span>
              <span className="text-[10px] bg-[#2C3E50] text-[#F9F8F6] px-1.5 py-0.5 rounded not-italic font-normal">실시간 피드백 가능</span>
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-normal">
              의견을 아래에 한국어로 내려주시면, **비용, 경쟁사 전략, 지표, 제목 등 모든 데이터가 실시간으로 재산조**된 최종 보고서가 즉시 좌측에 변동 반영됩니다.
            </p>
          </div>

          {/* Chat Messages Log view */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
            
            {/* Show initial placeholder instructions if NOT at step 3+ yet */}
            {step < 3 && (
              <div className="my-auto text-center space-y-4 px-6 py-8">
                <div className="w-12 h-12 bg-[#2C3E50]/15 text-[#2C3E50] mx-auto rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-slate-800">실시간 피드백 대화 대기 공간</h4>
                  <p className="text-[11px] text-slate-500 leading-normal max-w-sm mx-auto">
                    우선 **1단계 경력 프로필 강점 입력** 및 **2단계 뼈대 스트레스 인터뷰** 프로세스를 완료하셔야 본격적인 시장보고서 실시간 협동 보완 챗봇이 개방됩니다.
                  </p>
                </div>

                <div className="bg-white/80 p-3.5 border border-[#D1CEC7] text-[10px] text-left leading-relaxed text-[#2C3E50]">
                  <strong>💡 시니어 창업 맞춤 워크플로 엿보기:</strong>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-650">
                    <li>1. 경력 도메인 특화 사업초안 실시간 추종 빌딩</li>
                    <li>2. 창업 예비금, 초기 보증금, 채널 장벽 검증 인터뷰</li>
                    <li>3. 검증완료 정보로 BCG 프레임워크 기반 마켓 성과 보고서 생성</li>
                    <li>4. 챗봇을 통한 완벽 실무 정산 세밀 수정 및 PDF 출력</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Render actual chats */}
            {step >= 3 && chatHistory.map((chat) => {
              const isAssistant = chat.role === "assistant";
              return (
                <div
                  key={chat.id}
                  className={`p-3.5 rounded-sm max-w-[90%] leading-relaxed text-xs relative ${
                    isAssistant
                      ? "bg-white border border-[#D1CEC7] text-[#1A1A1A] self-start"
                      : "bg-[#2C3E50] text-[#F9F8F6] self-end rounded-br-none"
                  }`}
                >
                  {/* Avatar / name badges */}
                  <span className={`text-[9px] uppercase tracking-wider block mb-1 font-bold ${isAssistant ? 'text-[#2C3E50]' : 'text-[#A1B5CD]'}`}>
                    {isAssistant ? "■ BUSINESS CONSULTANT" : "■ REPRESENTATIVE"}
                  </span>
                  
                  <p className="whitespace-pre-wrap">{chat.text}</p>
                  
                  <span className="text-[8px] opacity-40 float-right mt-1 font-mono">
                    {chat.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="bg-white p-4 border border-[#D1CEC7] max-w-[90%] self-start flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-[#2C3E50] animate-spin shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-serif italic text-slate-800">심도 있는 실무 타당성 검사 진행 중...</p>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="p-4 bg-white border-t border-[#D1CEC7] shrink-0">
            {step < 3 ? (
              <div className="text-center py-2">
                <span className="text-[10px] text-slate-400 font-mono">Chat locked until Stage 3 Report Generation</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChatInstruction();
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    placeholder="수정할 사항을 입력 후 전송 버튼(혹은 엔터)을 누르세요..."
                    className="w-full bg-[#F9F8F6] border border-[#D1CEC7] py-3.5 pl-4 pr-12 text-xs focus:outline-none focus:border-[#2C3E50] italic text-[#1A1A1A]"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !userMsg.trim()}
                    className="absolute right-2 top-2 bg-[#2C3E50] text-[#F9F8F6] p-2 hover:bg-black transition-all rounded-xs disabled:opacity-40"
                    title="전송"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Instant Quick Action recommendation buttons for high usability */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold mb-1">▼ 빠르고 빈번하게 일어나는 시니어 수정 지시 추천 리스트:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleChatInstruction("초기 임대 비용과 보증금을 합쳐 점포 비용을 전체적으로 3천만원 대 보수적 수준으로 줄인 현실적 산정안으로 맞춰줘")}
                      className="text-[10px] px-2 py-1 bg-[#F1F0EC] hover:bg-[#D1CEC7] text-[#2C3E50] transition-all rounded-xs font-serif italic"
                      disabled={loading}
                    >
                      점포 비용 3천만원대 감축
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChatInstruction("오프라인 매장 전용 보다는 네이버 스마트스토어 혹은 B2B 계약대행 위주 온라인 무자본 마케팅 전술을 구체적으로 늘려줘")}
                      className="text-[10px] px-2 py-1 bg-[#F1F0EC] hover:bg-[#D1CEC7] text-[#2C3E50] transition-all rounded-xs font-serif italic"
                      disabled={loading}
                    >
                      B2B 온라인 마케팅 강화
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChatInstruction("경쟁사 B사 C사 약점을 시니어 연륜의 밀착 영업과 원재료 루트 수급 노하우로 완벽 격파하는 문맥으로 전격 고도화해줘")}
                      className="text-[10px] px-2 py-1 bg-[#F1F0EC] hover:bg-[#D1CEC7] text-[#2C3E50] transition-all rounded-xs font-serif italic"
                      disabled={loading}
                    >
                      경쟁사 격파 전술 강화
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </section>

      </main>

      {/* Persistent Status Over-Engineering Prevention Bottom Footer Bar */}
      <footer className="h-9 bg-[#2C3E50] text-white text-[10px] px-6 flex items-center justify-between shrink-0 border-t border-[#1C2833]">
        <div>PROJECT ID: BIZ_SENIOR_ACT_2026</div>
        <div className="opacity-65">© 2026 BIZPRO ARCHITECT AI SYSTEM. ALL RIGHTS RESERVED.</div>
        <div>AUTO-SAVE: CLOUD SYNCHRONIZED</div>
      </footer>

      {/* Loading Overlay Screen */}
      {loading && (
        <div className="fixed inset-0 bg-[#F9F8F6]/85 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white border border-[#D1CEC7] p-8 max-w-md w-full text-center space-y-6 shadow-xl rounded-xs">
            {/* Spinning Indicator circle icon */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-[#2C3E50]/15 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#2C3E50] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-serif italic text-lg text-[#2C3E50] font-bold">社</div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#2C3E50] font-bold block bg-[#F1F0EC] py-1 rounded">
                AI 컨설턴트 지식 연계 연산 중
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {loadingMsg || "잠시만 대기해 주세요. 경영 자문 모델이 열심히 데이터를 검정하고 있습니다..."}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 italic leading-normal border-t border-dashed border-[#D1CEC7] pt-4">
              "시니어의 축적 경력을 비즈니스로 올바르게 연결할 때 가장 가치 있는 혁신이 일어납니다."
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Fade Transition Overlay */}
      {transitionState.isTransitioning && (
        <div 
          className="fixed inset-0 bg-black z-[9999] pointer-events-none transition-opacity duration-300"
          style={{ opacity: transitionState.opacity }}
        />
      )}
    </div>
  );
}
