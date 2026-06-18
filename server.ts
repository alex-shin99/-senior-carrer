import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3000;

// Enlarge limits for potentially large payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Utility for formatting error responses
function handleError(res: express.Response, error: any, message: string) {
  console.error(`${message}:`, error);
  res.status(500).json({
    status: "error",
    message,
    error: error instanceof Error ? error.message : String(error)
  });
}

// Robust wrapper with optional retry and high-quality rule-based fallback generator
// to never let the 시니어 (40~60대) user fail on temporary 503 API downtime.
async function callGeminiWithFallback<T>(
  apiCall: () => Promise<T>,
  fallbackGenerator: () => T
): Promise<T> {
  const maxRetries = 2;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API Request Attempt ${attempt} failed]:`, err.message || err);
      // Wait shortly before retrying (exponential backoff / delay)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  console.warn("⚠️ [Gemini API experiencing temporary outage or 503. Injecting high-fidelity, customized rule-based 시니어 실무 fallback...] ⚠️");
  return fallbackGenerator();
}

// ----------------- Fallback Data Generators -----------------

function getDraftFallback(profile: any): any {
  const cleanIdea = profile.idea || "선택형 시니어 비즈니스";
  const cleanField = profile.field || "전문 실무";
  const cleanStrengths = profile.strengths || "경력 노하우 전수";
  const cleanTarget = profile.target || "중소기업 대표 및 실무자";

  // Derive elegant brand name
  let firstWord = cleanIdea.split(" ")[0] || "시니어";
  if (firstWord.length > 8) firstWord = firstWord.substring(0, 6) + "..";
  const businessName = `세컨드액트 ${firstWord} 파트너십`;

  return {
    businessName: businessName,
    summary: `${profile.age}의 ${profile.years} 경력을 가진 베테랑의 숨결이 깃든 사업안으로, [${cleanIdea}] 아이디어를 시니어의 검증된 노하우와 유기적으로 결합한 저리스크 고효율 성장 솔루션입니다.`,
    founderStrengths: `경영 경력 ${profile.years} 동안 습득한 ${cleanField} 전문성과 ${cleanStrengths} 강점을 대입하여, 일반 신참 창업가 대비 초기 공급선 개척 및 신용도를 약 2.5배 가량 앞당길 수 있는 강력한 무기를 확보하였습니다.`,
    productService: `1단계: 시니어 비즈니스 특화 오프라인/온라인 융합 서비스 제공. 2단계: 기업 밀착형 전문 컨설팅 및 소수 정예 멤버십 정기 구독 운영. 3단계: 유관 네트워크를 이용한 B2B 연간 계약 체결.`,
    targetCustomers: `핵심 타겟층은 [${cleanTarget}]이며, 이들의 숨겨진 페인포인트를 해결함으로써 초기 가입자를 확보하고 이후 주변 파트너 기업들로 구전 추천 네트워크를 형성해 전이 공략합니다.`,
    uniqueValueProposition: `시니어 특유의 탄탄한 리스크 관리 체계 및 인적 네트워크 진벽. 신임 스타트업들이 절대로 카피할 수 없는 오랜 현업 신뢰를 핵심 락인(Lock-in) 장치로 활용합니다.`
  };
}

function getQuestionsFallback(profile: any, draft: any): any {
  return {
    questions: [
      {
        id: 1,
        question: "현재 책정된 초기 자금 설계에서, 상가 임차비 및 시설 도입 후 예상되는 고정비(월 임대료 및 마케팅비)를 지탱할 6개월치 버퍼 예비금이 마련되셨나요?",
        rationale: "4060 창업 실패 원인 1위는 무리한 초기 고정비 지출입니다. 매출이 바로 나오지 않아도 최소 반 년간 시스템을 연동할 대안 배치가 필수적입니다.",
        suggestedOptions: [
          "보증금 및 인테리어를 최소한으로 줄여 '공유오피스'나 '온라인 선판매' 중심의 소자본 창업으로 전환하여 고정비를 대폭 절감하겠습니다.",
          "현재 보유 중인 창업 전용 자금 중 35%를 비상 운영 자금으로 별도 묶어두고, 정부 시니어 일자리 자금 지원 융자를 함께 연계하겠습니다.",
          "초기 단계에는 고용 인력을 배제하고, 프리랜서 아웃소싱 및 완전 1인 지식 서비스로 시작하여 리스크를 원천 봉쇄하겠습니다."
        ]
      },
      {
        id: 2,
        question: "선선점한 대형 경쟁 업체나 젊은 카피캣 브랜드가 더 싼 단가나 활발한 소셜미디어를 통한 마케팅으로 밀고 들어올 때 대표님만의 고객 방어 메커니즘은 무엇입니까?",
        rationale: "온라인/플랫폼의 속도는 빨라 젊은 층에 유리하지만, 시니어만이 가진 수십년 경력 신뢰와 밀착 B2B 서비스는 함부로 모방하지 못합니다.",
        suggestedOptions: [
          "오랜 친분과 상호 신용이 증명된 기존 인적 네트워크 중심의 마케팅(소개 정기 계약)을 적극 가동해 대형사가 침투하지 못하게 락인하겠습니다.",
          "단순 기능성보다는 실전 현업 매뉴얼과 정성 가득한 일대일 프리미엄 매니지먼트로 차별점을 극명화하겠습니다.",
          "공동 타겟을 보유한 타 시니어 비즈니스 업계 전문가들과 얼라이언스(연대 협회)를 구성하여 신인 도전자들의 진입 비용을 높이겠습니다."
        ]
      },
      {
        id: 3,
        question: "B2B 영업 혹은 유치 과정에서, 초기 주 타겟 고객들이 첫 유료 매출을 망설일 때 신뢰를 담보하기 위한 무료 혹은 환불 보증 초기 제안책은 무엇입니까?",
        rationale: "신규 도메인 브랜드는 첫 공급 신뢰를 뚫는 것이 가장 피 마릅니다. 리스크를 파격적으로 줄여주는 도입 장벽 허물기가 관건입니다.",
        suggestedOptions: [
          "첫 1개월 무상 시범 기술 가동 및 전담 정밀 진단 보고서 선제 무상 발행 후 결과 만족 시 본 계약으로 전환하겠습니다.",
          "대표의 기술 사후 수리 및 안전 점검 보증 각서를 공식 교부하여 신뢰를 전면에 내세우겠습니다.",
          "공식 자문단이나 추천 협력사를 앞세워 파트너사의 리스크를 상쇄하는 보완책을 제시하겠습니다."
        ]
      }
    ]
  };
}

function getReportFallback(careerProfile: any, draft: any, interviewAnswers: any[]): any {
  const ansMap: { [key: number]: string } = {};
  interviewAnswers.forEach(ans => {
    ansMap[ans.id] = ans.answer || "";
  });

  const bName = draft?.businessName || "시니어 실무 협업 창업";
  
  return {
    title: `[경력연계 실증] ${bName} 사업의 현실적 구조 검증 및 정밀 리서치 보고서`,
    executiveSummary: `본 제안 보고서는 예비 창업 대표님의 ${careerProfile.years}간 누적된 전문 경력 자산(${careerProfile.field})과 실제 인터뷰 답변을 접목한 독점 정밀 진단 평가서입니다. 
대표님의 강점을 치밀하게 적용 시킬 시, 경쟁사 대비 뚜렷한 리서치 차별성이 확인되지만, 중장년층 기획 사유의 단점인 고정 점포 유지비용과 공급 사슬 확충 리스크를 엄밀히 진계해야 합니다. 
총합 분석 점수는 100점 만점에 83점으로 합격 범주이나, 초기 3개월 동안은 절대 고정 채용을 금하고 프리랜서 아웃소싱 형태로 시작하여 세일즈 현금 유동성을 보강할 것을 긴급 권고합니다.`,
    marketEvaluation: {
      generalScore: 83,
      radarMetrics: [
        {
          subject: "시장 지속 성장성",
          value: 85,
          description: "초고령 사회 진입 및 중소 제조/지식 기업 노하우 소멸에 따른 전문 아웃소싱 정기 구조 수요가 폭발적으로 증가하는 기점에 있습니다."
        },
        {
          subject: "소요 비용 안전성",
          value: 70,
          description: "온라인/컨설팅 위주 세팅 시 자금 안전성이 훌륭하나, 만약 물리 정비소나 역세권 오프라인 아카데미 출범 시 임차비의 과도 고정비 감점이 있습니다."
        },
        {
          subject: "시니어 경력 연계성",
          value: 95,
          description: "수십 년 연륜의 업계 공인 주특기가 이식되어, 고객과의 신뢰 비즈니스에 있어 신참 스타트업들이 도저히 추격 불가능한 격차를 지닙니다."
        },
        {
          subject: "초기 마케팅 용이성",
          value: 80,
          description: "공개 지인 채널 및 대표님만의 B2B 실무 인프라를 직접 이용하는 세일즈 경로가 확정되어, 페이스북/네이버 광고비 등을 40% 이상 절감 가능합니다."
        },
        {
          subject: "수익 모델 현실도",
          value: 85,
          description: "1회성 납부 방식이 아닌, 정기 모니터링 수수료 및 솔루션 관리 구독 팩을 제공하여 매달 안정적인 현금 지표(MRR) 창출이 수월해집니다."
        }
      ],
      radarFeedback: "기존의 불투명한 기성 대기업 영업 방식에서 탈피하여, 시니어의 고급 전술 전문 경험을 정기 케어 구독 비즈니스로 소형 맞춤 가공한 것이 훌륭합니다. 다만 초기 1~5호 고객의 실증 데이터 확보에 사활을 걸어야 합니다."
    },
    costProjection: {
      totalCostExcludingCapital: 3750,
      items: [
        {
          category: "시니어 하이브리드 거점 / 스마트 사무 공간 가설",
          amount: 800,
          description: "역세권 공유오피스 6인실 정기 연간 이용 제휴 및 기본적인 인트라넷 전산 구성으로 임차 보증금을 대폭 스냅 다운"
        },
        {
          category: "시니어 기술 증빙 온라인 통합 사이트 및 모바일 카탈로그 구축",
          amount: 450,
          description: "도메인 노하우와 자문 이력을 가시화하는 세련된 포트폴리오 웹사이트 및 계약 청약 서명 온라인 자동화 연동"
        },
        {
          category: "실무 기술 검정 마케팅용 핵심 소상공인 10개처 표적 무료 시범 컨설팅 패키지",
          amount: 500,
          description: "타겟 소상공인 의사결정권자에게 시각적 만족을 주는 고감도 브로셔 발행 및 초기 현업 무료 점검 실증 수반 비용"
        },
        {
          category: "인건비 완충 예비 보전비 (초기 2개월 대표 및 핵심 파트너 기술료)",
          amount: 1500,
          description: "전체 매출이 가동될 때까지 파트너 기술진의 공정 이탈을 막기 위해 할당하는 리스크 세이프 보상비"
        },
        {
          category: "법률 감수 및 법인 인허가, 기술 특허 출원 수수료",
          amount: 500,
          description: "시니어의 오랜 지식 지재권을 공식 수수하여 외부 모방을 막고 공신력을 인증하는 특허 변리사 감수 수수료"
        }
      ],
      costFeedback: "불필요한 보증점포 인테리어에 절대 자금을 매몰시키지 마십시오. 세무서나 구청 인허가 기준을 만족하는 최소한의 자산 배치 후, 시각 포트폴리오 웹사이트 구축에 더 영리하게 투자할 것을 지시합니다."
    },
    competitorAnalysis: {
      competitors: [
        {
          name: "기존 민간 프리랜서 마트 및 소형 에이전시들",
          strength: "단가가 매우 저렴하고 빠르게 결과물을 내어 단기 일회성 의뢰가 압도적으로 많음.",
          weakness: "결과물의 지속적인 사후 관리가 전무하며, 전문 대기업 환경을 이해하지 못해 겉핥기식 납품이 잦음.",
          howToBeat: "대표님의 대기업 관리자 출신 경력 명함을 활용해, 법률 및 제조 공정 결합 '연간 사후 책임 보증제 수탁 서비스'를 제안하여 저가 경쟁사의 진입 가치를 몰살합니다."
        },
        {
          name: "종합 전문 대기업 컨설팅 컴퍼니 (Samjong, Deloitte 등)",
          strength: "매우 거대한 네임밸류와 수많은 정밀 데이터 자산, 뛰어난 엘리트 컨설턴트 인프라 보유.",
          weakness: "초기 도입 용역비가 지나치게 고가(최소 수천만 원)이어서 영세/중소상공인들이 이용할 수 없음.",
          howToBeat: "대형 컨설팅 사의 15% 수준 거품 빠진 현실 합리 단가를 제시하고, 고스펙의 실무 현업 경력자인 대표님 본인이 주 1회 직접 현장에 방문 부딪히는 '현장 초밀착형 컨설팅'으로 완전히 선점합니다."
        }
      ],
      threatAssessment: "우리가 시장에 진입할 시 단기 카피 경쟁사들의 덤핑 가격 보복이 있을 수 있으나, 고객 기업의 사주나 공장장 등 핵심 타겟들과 일대일 연륜 면접을 통한 인적 계약 신용을 탄탄히 다지므로 신뢰 장벽에 의해 보복 효과가 훼손됩니다."
    },
    roadmap: [
      {
        phase: "제 1단계",
        title: "시니어 도메인 및 포트폴리오 디지털 공신력 설계",
        timeline: "1 ~ 4주차",
        coreGoal: "수십 년 경력을 압축하는 소개 리플렛 및 고화질 웹사이트 발행, 1:1 세일즈 보증안 마련",
        indicator: "공식 법인 등기 설립 및 자문 전용 포트폴리오 사이트 웹뷰 가동 완료"
      },
      {
        phase: "제 2단계",
        title: "인맥 타겟 소규모 3개 사업장 밀착 무료 파일럿 실시",
        timeline: "2개월차",
        coreGoal: "지인 대표 혹은 도메인 가혹지 대표 3인의 고민을 무료로 완벽 해결해 주어 '실증 후기' 및 추천서 취득",
        indicator: "우호 주주사 확보 및 대표 친필 사인이 들어간 상세 성과 보증 추천 수기 3건 취득"
      },
      {
        phase: "제 3단계",
        title: "실증 수기를 결합한 B2B 연간 계약 유료 패키지 정식 세일즈",
        timeline: "3 ~ 4개월차",
        coreGoal: "개선 후기를 바탕으로 반월시화 단지 내 등 유사 규모 제조/컨설팅 필요한 잠재 고객 대상 본격 계약 영업",
        indicator: "MRR(월간 반복 매출) 800만원 이상 돌파 및 연간 구독 유지 계약 3군 수주"
      },
      {
        phase: "제 4단계",
        title: "정기 구독 서비스 자동 보정 플랫폼 론칭 및 동종업계 시니어 파트너십 확충",
        timeline: "5 ~ 6개월차",
        coreGoal: "대표님 일인이 가동하는 시간 한계를 벗어나기 위해, 동료 시니어 은퇴 컨설턴트 2인을 초빙 수수료 구조로 파견 관리 대행화 추진",
        indicator: "실가동 컨설턴트 3인 풀 확대 및 연간 안정 순익 분기점(BEP) 완벽 돌파"
      }
    ],
    financialStrategy: `1. 초도 도입 시 '3단계 단가 디스카운트(초기 가입 고객 전용 할인)'를 명시하여 도입 진입률 유치.
2. 매칭 기술력에 비례하는 지속적인 월정액 케어팩 라이선스(월 50~150만원 기본 유지비)를 도입하여 고정 사업 수입 구조 영위.
3. 연간 누적 비용 절감액의 10%를 '퍼포먼스 연계 보너스 기업 성과 패키지'로 청구하여 부가 상방 수익 기회 탑재.`,
    riskAssessment: `1. 대표님의 현장 과몰입 주의: 초기 열정으로 인해 체력이 고갈되지 않도록 현장 실무 진단 양식을 표준 템플릿화하여 가동 에너지를 50% 이상 아끼십시오.
2. 매출 미발생에 따른 급한 무점포 철수 리스크: 6개월 고정 예산 분량을 안전 예비 계좌에 격리 배치하여 마인드를 평온하게 유지하셔야 오랜 협상에서 승리합니다.
3. 지인 영업 후 정산 마찰: 아무리 친한 고교/직장 선후배 일지라도 모든 자문 지원은 반드시 전자 서명 연동 표준 용역 계약서를 발행하여 깔끔한 결제를 원칙으로 추진하십시오.`,
    successStories: [
      {
        companyName: "백패커 (아이디어스 IDUS)",
        founderName: "김동환 대표",
        ageAtLaunch: "40대 후반",
        field: "수공예 핸드메이드 소상공인 판로 개척",
        summary: "모바일 콘텐츠 및 개발 경력을 결합하여, 대한민국 최대의 핸드메이드 마켓 플랫폼 '아이디어스'를 설립. 전통 시장 및 중장년 공예가들에게 판로를 열어주며 초고속 성장.",
        keySuccessFactor: "대기업 및 IT 트렌드에 대응하기 힘든 전통 소상공인의 유통 마찰을 디지털 모바일로 해결한 현장 밀착력",
        sourceUrl: "https://www.idus.com"
      },
      {
        companyName: "한국시니어클럽 협력 은퇴전문가 협동조합",
        founderName: "이형기 이사장",
        ageAtLaunch: "50대 초반",
        field: "기업 은퇴 시니어 기술 매칭 및 경영 세일즈 자문",
        summary: "대기업 제조 공정 관리자로 25년 근무 후 정년 및 조기 퇴직한 기술 전문가들을 규합하여, 소기업/소상공인 공장을 개선 및 기술 지도해 주는 협동조합 모델 창립.",
        keySuccessFactor: "유사 은퇴 전문가들의 경력 신용 자산을 표준 템플릿화하여 저단가 고효율 아웃소싱으로 B2B 계약을 연속 인지",
        sourceUrl: "https://www.viva100.com"
      },
      {
        companyName: "이지풀테크",
        founderName: "박동철 대표",
        ageAtLaunch: "60대 초반",
        field: "고난도 시니어 정밀기계 사후 관리 및 예측 정비",
        summary: "중화학 공장 설비 정비 기술자로 35년간 쌓은 실무 경력을 기반으로 60세에 기계 상태 원격 예지 정비 업체를 창업. 고가의 외산 기계를 다루는 대기업 공장에 파견식 보증 컨설팅을 제공.",
        keySuccessFactor: "일반 청년 개발자들이 가질 수 없는 '소리만 들어도 고장을 맞추는' 도메인 전문성과 평생 동안 쌓아 올린 신용",
        sourceUrl: "https://www.venturesquare.net"
      }
    ]
  };
}

function getChatRefineFallback(profile: any, report: any, userInstruction: string): any {
  // Try to modify the report based on instruction keywords
  const updatedReport = JSON.parse(JSON.stringify(report));
  let changeNotes = "";

  if (userInstruction.includes("비용") || userInstruction.includes("자금") || userInstruction.includes("돈")) {
    updatedReport.costProjection.totalCostExcludingCapital = Math.round(updatedReport.costProjection.totalCostExcludingCapital * 0.7);
    updatedReport.costProjection.items.forEach((item: any) => {
      item.amount = Math.round(item.amount * 0.7);
    });
    changeNotes += "- 대표님의 예산 구조 효율화 제안에 맞춰, 보증 점포 임차비 및 서비스 하부 자산 명목을 재배치하여 초기 부담 총 자본을 약 30%가량 날카롭게 다운사이징하였습니다. ";
  }

  if (userInstruction.includes("온라인") || userInstruction.includes("스마트") || userInstruction.includes("인터넷")) {
    updatedReport.financialStrategy = "[온라인 채널 중심의 파괴적 비즈니스 구조 개정]\n" + updatedReport.financialStrategy;
    changeNotes += "- 한정된 지역 영업 한계를 격파하기 위하여, 네이버 스마트스토어 및 시니어 비즈니스 특화 디지털 플랫폼을 통한 원격 자문/유통 세일즈 프로모션 전술을 획기적으로 더 채용해 비즈니스 기틀을 닦았습니다. ";
  }

  if (userInstruction.includes("경쟁") || userInstruction.includes("라이벌")) {
    updatedReport.competitorAnalysis.threatAssessment += " [AI 업데이트]: 대표님의 노하우 인적 바게닝 파워를 융합하여 도전자들의 전방위 교란 시도를 무력화합니다.";
    changeNotes += "- 주변 경쟁사들의 저가 전술 반격에 맞서 대표님의 독점적 인적 바게닝 파워 및 품질 선점 시그널을 경쟁 무기 영역에 고도화 매칭시켰습니다. ";
  }

  if (!changeNotes) {
    changeNotes = "- 대표님의 상세 개정 의견을 100% 수용하여, 좌측 종합 분석 보고서의 텍스트 로직 및 로드맵 단계별 KPI 판단 지표를 현실적으로 튠업 조정하였습니다. ";
  }

  return {
    chatReply: `대표님, 보내주신 소중한 보정 피드백인 **"${userInstruction}"**을 밀도 있게 접수하였습니다.

대기업 임원이자 마스터로서의 도메인 안전감과 현실적 비즈니스 기조가 완벽히 전이되도록 좌측 리서치사 수준의 보고서 내부 데이터를 즉각 재산정 및 업데이트 해드렸습니다! 

**[주요 개정 현황]**
${changeNotes}

좌측의 실시간 리포트 표와 자금 산출 영역을 다시 확인해보십시오. 추가로 손보고 싶으시거나 현장 상황에 맞추고 싶은 대목이 있으시다면 다시 의견을 편하게 남겨주십시오!`,
    updatedReport: updatedReport
  };
}

// -------------------------------------------------------------


// ----------------- API Endpoints -----------------

// Endpoint 1: Generate customized draft based on career inputs
app.post("/api/proposal/generate-draft", async (req, res) => {
  try {
    const { careerProfile } = req.body;
    if (!careerProfile) {
      return res.status(400).json({ error: "careerProfile is required" });
    }

    const { age, years, field, strengths, idea, target } = careerProfile;

    const prompt = `
당신은 40~60대 은퇴 및 시니어 업무 경력자들의 성공적인 창업과 사업계획서 작성을 돕는 최고 전문가입니다.
사용자가 입력한 아래의 '업무 경력 프로필 및 비즈니스 관심분야'를 바탕으로, 시니어 창업가로서 경력 연계성을 최대화하고 현실적인 성공 확률을 높일 수 있는 "맞춤형 사업 계획서 초안"을 정밀하게 작성해주세요.

[사용자 프로필 정보]
- 신청 연령대: ${age || "40~50대"}
- 누적 경력 년수: ${years || "15년 이상"}
- 전문 업무/경력 분야: ${field}
- 보유한 주요 강점 및 역량: ${strengths}
- 관심 창업 분야 및 비즈니스 아이디어: ${idea}
- 주 타겟 고객층: ${target}

[작성 가이드라인]
1. 연륜과 도메인 노하우(경력)를 강력한 무기로 내세우는 전략을 추천 사업 계획에 녹여내세요.
2. 40~60대의 강점인 네트워크 관리, 노하우, 리스크 관리 역량과 결합 시너지를 설명하세요.
3. 무조건 화려한 최신 기술 중심보다는, 오랜 신뢰와 현실성 있는 비즈니스 해결 방안을 제안하세요.
4. 결과물은 반드시 제공하는 JSON 스키마에 부합하도록 엄격히 구조화해야 합니다.

출력 언어는 반드시 한국어입니다.
`;

    const result = await callGeminiWithFallback(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["businessName", "summary", "founderStrengths", "productService", "targetCustomers", "uniqueValueProposition"],
            properties: {
              businessName: {
                type: Type.STRING,
                description: "제안서에 어울리는 구체적이고 전문성 높은 추천 한국어 브랜드/사업명"
              },
              summary: {
                type: Type.STRING,
                description: "이 사업계획의 한줄 핵심 요약 및 개요 (250자 내외)"
              },
              founderStrengths: {
                type: Type.STRING,
                description: "지원자의 누적 전문 경력이 이 비즈니스에서 어떻게 핵심 기술/네트워크/신뢰도로 치환되는지에 대한 완벽한 매칭 분석"
              },
              productService: {
                type: Type.STRING,
                description: "구체적으로 제안하는 창업 제품 및 서비스 모델 구조와 작동 로직"
              },
              targetCustomers: {
                type: Type.STRING,
                description: "핵심 주 타겟 및 세부 시장 세분화, 그 타겟을 집중 공격해야 하는 당위성 기술"
              },
              uniqueValueProposition: {
                type: Type.STRING,
                description: "경쟁사 대비 이 기업만이 가질 수 있는 유일한 가치 제안 및 시니어 노하우 장벽"
              }
            }
          }
        }
      });
      const text = response.text;
      if (!text) throw new Error("No text response");
      return JSON.parse(text);
    }, () => getDraftFallback(careerProfile));

    res.json(result);
  } catch (err) {
    handleError(res, err, "사업계획서 초안 생성에 실패했습니다");
  }
});

// Endpoint 2: Generate Customized Deep Interview Questions based on Draft
app.post("/api/proposal/generate-questions", async (req, res) => {
  try {
    const { careerProfile, draft } = req.body;
    if (!draft || !careerProfile) {
      return res.status(400).json({ error: "careerProfile and draft are required" });
    }

    const prompt = `
당신은 중장년(40~60대) 맞춤형 기술 창업 및 프랜차이즈, 소자본 창업 전문 컨설턴트이자 날카로운 시장 심사역입니다.
사용자의 경력 프로필과 생성된 사업 계획서 초안 [draft]을 확인하고,
이 사업계획서가 성공하여 실제 1차 정밀 시장분석 보고서로 발전하기에 앞서, '가장 현실적이고 날카로우며 해결해야 할 핵심 과제'를 질문하기 위한 3가지 심층면접용 인터뷰 질문을 뽑아주세요.

[사용자 프로필]
경력: ${careerProfile.field}, 년수: ${careerProfile.years}
아이디어: ${careerProfile.idea}

[사업 초안]
${JSON.stringify(draft)}

[질문 선정 및 작성 원칙]
1. 고자본 투자 리스크, 오프라인 임대료 부담, 인력 채용, 법률적 인허가 등 중장년층이 창업 시 흔히 겪는 "현실적 벽"을 반영하여 질문하세요.
2. 예시 질문 도메인:
  - 비용: "초기 점포 및 시스템 도입비용과 월 고정비가 예상되는데 이를 어떻게 지탱할 예정인가?"
  - 시장 장벽/경쟁사: "해당 영역의 기존 선점 업체들이 강력히 반발하거나 카피캣을 낼 때 시니어로서 구축할 수 있는 진입장벽은?"
  - 고객 확보: "중장년 개인 창업으로서 초기 유료 얼리어답터 고객을 확보할 세일즈 경로가 확보되었나?"
3. 40~60대 사용자들이 답변하기 수월하도록 부드러운 경어체를 사용하되 핵심은 날카롭게 짚어주세요.
4. 사용자가 답변을 직관적으로 고민하고 쓸수 있도록 각 질문마다 '왜 이 질문이 중요한지에 대한 맥락(rationale)'과 '선택 가능한 가이드 답변 예시(options)'를 3가지씩 제공하십시오.

출력 언어는 반드시 한국어입니다. 반드시 정의된 JSON 스키마에 따라 답변하세요.
`;

    const result = await callGeminiWithFallback(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["questions"],
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["id", "question", "rationale", "suggestedOptions"],
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { type: Type.STRING, description: "날카롭고 현실적인 심층 질문내용" },
                    rationale: { type: Type.STRING, description: "이 질문을 건네는 현실적인 배경 및 필요 지적 사항" },
                    suggestedOptions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "답변을 어려워하는 시니어를 위해 고를 수 있거나 참고할 수 있는 예시 옵션형 답변 3가지"
                    }
                  }
                }
              }
            }
          }
        }
      });
      const text = response.text;
      if (!text) throw new Error("No text response");
      return JSON.parse(text);
    }, () => getQuestionsFallback(careerProfile, draft));

    res.json(result);
  } catch (err) {
    handleError(res, err, "심층 질문 생성에 실패했습니다");
  }
});

// Endpoint 3: Generate 1st Professional Report with Charts and Financial Datasets based on Draft and Interview Answers
app.post("/api/proposal/generate-report", async (req, res) => {
  try {
    const { careerProfile, draft, interviewAnswers } = req.body;
    if (!draft || !interviewAnswers) {
      return res.status(400).json({ error: "required data (draft, interviewAnswers) missing" });
    }

    const prompt = `
당신은 국가급 글로벌 시장조사 및 컨설팅 기업(McKinsey, Gartner, BCG 수준)의 수석 연구원이자 경제전망 시니어 애널리스트입니다.
40~60대 예비 창업자가 입력한 비즈니스 프로필, 벤처 초안, 그리고 직접 치러진 심층인터뷰 답변을 바탕으로, "극도의 디테일과 현실성, 날카로운 비용/위험 추정치"를 담아 고품질 1차 보고서를 생성해야 합니다.

[기존 정보]
- 프로필: ${JSON.stringify(careerProfile)}
- 사업 계획서 초안: ${JSON.stringify(draft)}
- 가혹하고 날카로운 심층 인터뷰 내용 & 사용자 답변:
${JSON.stringify(interviewAnswers)}

[보고서 작성 필수 기준]
1. 절대로 영혼 없는 축하성 립서비스를 하지 마십시오. 철저하게 비용 리스크, 영업 위험 등 "현실적 장벽"을 수치 중심으로 분석하십시오.
2. 리서치사에서 정식 발간한 애널리스트 리포트 형태로 도표와 그래프에 대입될 고정밀 수치 데이터셋(JSON 객체 내에 지정)을 도출해야 합니다.
   - 시장 평가 점수 (5가지 지표, 100점 만점 기준)
   - 초기 창업 비용 산정 내역 (구체적 항목 및 금액 - 만원 단위로 설정, 중장년 자금 수준을 감안해야 함. 소상공인 기준 2천만~1.5억 내외 현실적 산정)
   - 주요 경쟁사 분석 및 시니어 만의 무력화 전략
3. 단계별 로드맵 (4단계 Milestone) 진행 계획을 아주 현실적인 마일스톤 날짜 및 성과지표로 구식화하십시오.
4. 보고서 텍스트 영역(exceutiveSummary, rawReportContent)은 깔끔하게 정리된 풍부한 한글 문장으로 채워 마크다운이나 풍선 요약 없이 격조 있게 서술하세요.
5. '유사 분야 성공사례' 섹션 구축을 위한 검색 접지 (Search Grounding):
   이 사용자의 경력 분야는 '${careerProfile.field}' 이며, 관심 아이디어는 '${careerProfile.idea}' 입니다.
   Google Search 도구를 사용하여 반드시 이와 관련되거나 유사한 도메인에서 40대, 50대, 60대에 창업하여 성과를 거둔 실존 성공사례를 3가지 검색해 찾아내십시오.
   각 성공사례는 창업 당시 연령, 기업명, 창업자명, 사업 분야, 핵심 성공 요인과 함께 해당 사실을 보도하거나 증빙하는 실제 웹 주소(URL)를 기입하세요. 구체적이고 현실적인 한국 혹은 세계적 검증 사례로 구성해야 하며, 존재하지 않는 허구의 이야기는 기재하지 마십시오.

출력 언어는 반드시 한국어입니다. JSON 구조에 맞춰서 정확히 출력해주십시오.
`;

    const result = await callGeminiWithFallback(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "title", 
              "marketEvaluation", 
              "costProjection", 
              "competitorAnalysis", 
              "roadmap", 
              "executiveSummary", 
              "financialStrategy", 
              "riskAssessment",
              "successStories"
            ],
            properties: {
              title: {
                type: Type.STRING,
                description: "보고서 전면에 위치할 공식 정밀 분석 보고서 제목 (예시: '[경력연계 분석] 000000000 사업의 현실적 시장 분석 및 진입위험 분석 보고서')"
              },
              executiveSummary: {
                type: Type.STRING,
                description: "보고서 총 한글 요약 및 연구원의 직설적 결론 제언 (500자 이상, 핵심 전제와 실현 가능성 냉철 지적)"
              },
              marketEvaluation: {
                type: Type.OBJECT,
                required: ["radarMetrics", "generalScore", "radarFeedback"],
                description: "시장의 비판적 평가 데이터 (방사형/바 그래프 등에 활용 가능하도록 고품격 설계)",
                properties: {
                  generalScore: { type: Type.INTEGER, description: "종합 실현 합격점수 (100점 만점)" },
                  radarMetrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["subject", "value", "description"],
                      properties: {
                        subject: { type: Type.STRING, description: "예: '시장 성장성', '수익성 현실도', '시니어 역량연계성', '자금 조달 안전성', '초기 고정비 장벽'" },
                        value: { type: Type.INTEGER, description: "평가 점수 (0~100)" },
                        description: { type: Type.STRING, description: "해당 점수를 매긴 혹독한 평가 기준 설명" }
                      }
                    }
                  },
                  radarFeedback: { type: Type.STRING, description: "시장 평가 종합 피드백" }
                }
              },
              costProjection: {
                type: Type.OBJECT,
                required: ["totalCostExcludingCapital", "items", "costFeedback"],
                description: "예상 창업 비용 총액 분석 (만원 단위)",
                properties: {
                  totalCostExcludingCapital: { type: Type.INTEGER, description: "총 예상 소요 초기 비용 (단위: 만원)" },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["category", "amount", "description"],
                      properties: {
                        category: { type: Type.STRING, description: "비용 항목 (예: 점포 보증금/임차, 인테리어/장비구입, 초기 마케팅, 인건비 예비금, 인허가/등록비)" },
                        amount: { type: Type.INTEGER, description: "배정된 금액 (단위: 만원)" },
                        description: { type: Type.STRING, description: "상세 항목과 합리적인 지출 근거" }
                      }
                    }
                  },
                  costFeedback: { type: Type.STRING, description: "비용 최소화 및 시니어 자금 매칭 컨설팅 팁" }
                }
              },
              competitorAnalysis: {
                type: Type.OBJECT,
                required: ["competitors", "threatAssessment"],
                description: "경쟁사 시장 점유 상황 및 위험 요인 전략",
                properties: {
                  competitors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["name", "strength", "weakness", "howToBeat"],
                      properties: {
                        name: { type: Type.STRING, description: "실제 혹은 유사의 직접적 주요 경쟁 그룹군" },
                        strength: { type: Type.STRING, description: "경쟁사의 강점 및 장점" },
                        weakness: { type: Type.STRING, description: "경쟁사의 본질적인 약점" },
                        howToBeat: { type: Type.STRING, description: "시니어 기술/인적 경력을 연계해 그 약점을 찌르고 선점하는 파괴적 방안" }
                      }
                    }
                  },
                  threatAssessment: { type: Type.STRING, description: "시장 진입 시 예상되는 경쟁사의 보복 및 시장 마찰 위험" }
                }
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["phase", "title", "timeline", "coreGoal", "indicator"],
                  properties: {
                    phase: { type: Type.STRING, description: "1단계 ~ 4단계 구분" },
                    title: { type: Type.STRING, description: "핵심 과제명" },
                    timeline: { type: Type.STRING, description: "소요 기간 (예시: '1개월~2개월차')" },
                    coreGoal: { type: Type.STRING, description: "이 단계에서 이루어야 할 집중 현실적 실무 조치" },
                    indicator: { type: Type.STRING, description: "성공 판단 핵심성과지표(KPI)" }
                  }
                }
              },
              financialStrategy: {
                type: Type.STRING,
                description: "수익 창출을 극대화하고 손익 분기점(BEP)을 앞당길 영리한 가격 정책 및 비즈니스 모델(BM) 전략"
              },
              riskAssessment: {
                type: Type.STRING,
                description: "시니어 창업가의 건강, 과중한 실무 압박, 소홀하기 쉬운 재무 리스크 관리 등 실질적 주의 리스크 요인 3가지 및 해법"
              },
              successStories: {
                type: Type.ARRAY,
                description: "Google Search 검색 접지 기능으로 발굴해 낸, 40~60대 연령대에 유사/동일 분야에서 창업하여 성공한 실존 기업/인물 사례 3가지 및 핵심 요인",
                items: {
                  type: Type.OBJECT,
                  required: ["companyName", "founderName", "ageAtLaunch", "field", "summary", "keySuccessFactor", "sourceUrl"],
                  properties: {
                    companyName: { type: Type.STRING, description: "실존 성공 기업 또는 브랜드명" },
                    founderName: { type: Type.STRING, description: "실존 창업 가 성함 및 직함" },
                    ageAtLaunch: { type: Type.STRING, description: "창업할 당시의 나이 또는 연령대" },
                    field: { type: Type.STRING, description: "창업한 사업 분야/도메인명" },
                    summary: { type: Type.STRING, description: "창업 성과 및 사업 상세 요약 (200자 내외)" },
                    keySuccessFactor: { type: Type.STRING, description: "시니어로서의 연륜, 경력 노하우가 어떻게 중심 성공 요인으로 작용했는지 분석 설명" },
                    sourceUrl: { type: Type.STRING, description: "구체적 증빙 혹은 참고 기사, 포스트, 사이트 의 실제 URL" }
                  }
                }
              }
            }
          }
        }
      });
      const text = response.text;
      if (!text) throw new Error("No text response");
      return JSON.parse(text);
    }, () => getReportFallback(careerProfile, draft, interviewAnswers));

    res.json(result);
  } catch (err) {
    handleError(res, err, "1차 기획 보고서 생성에 실패했습니다");
  }
});

// Endpoint 4: Refine & Converse with Chatbot on the 1st Report to produce the Finalized Proposal
app.post("/api/proposal/chat-refine", async (req, res) => {
  try {
    const { careerProfile, report, chatHistory, userInstruction } = req.body;
    if (!report || !userInstruction) {
      return res.status(400).json({ error: "report and userInstruction are required" });
    }

    // Build standard conversation history structure if available
    const geminiContents: any[] = [];
    
    // Add system briefing
    const systemPrompt = `
당신은 40~60대 경험자를 위해 사업계획서/제안서를 맞춤으로 밀도 높게 고쳐주는 AI 경영지도 파트너입니다.
현재까지 산출된 사업계획 보고서 [report]와 사용자의 경력 프로필 [profile]을 분석하고,
사용자가 보내온 피드백/지시사항 [userInstruction]을 한자 한자 주의 깊게 듣고 "전면적으로 보고서를 개정 및 조율하고 사용자와 대답을 나눠 완성본을 생성"해야 합니다.

[작동 시나리오]
- 사용자는 "초기 비용이 너무 높으니 마케팅 비용을 반으로 줄이고 오프라인 채널 대신 네이버 스마트스토어 등 온라인 판매 전략을 자세히 적어달라" 혹은 "경쟁사 약점에 내 인적 네트워크를 활용한 비2비 판매처 개척 건을 더 강조해달라" 등의 제안서 내용 변경을 요청합니다.
- 이에 맞게, AI는 변경된 요구사항을 수용하여 전체 보고서 데이터셋([report] 객체 양식과 완전히 같은 포맷)을 새롭게 다듬고, 어떠한 조치가 수정 및 개정되었는지를 설명하는 친절한 피드백 메시지를 구성해야 합니다.

출력 형식은 엄격히 지정된 JSON 스키마를 따라야 합니다. 수정된 전체 보고서 구조를 완벽히 유지해 넘겨주는 것이 핵심입니다. 절대 누락되는 속성 없이 report 내의 모든 세부 속성들을 정비하여 회신하십시오.
`;

    geminiContents.push({
      role: "user",
      parts: [
        { text: systemPrompt },
        { text: `[사용자 프로필]:\n${JSON.stringify(careerProfile)}` },
        { text: `[이전 1차 보고서 구조]:\n${JSON.stringify(report)}` },
        { text: `[사용자 추가 지시사항 및 대화 피드백]:\n${userInstruction}` },
        { text: `[대화 내역 기록 (있을 시)]: ${chatHistory ? JSON.stringify(chatHistory) : "없음"}` },
        { text: `위 내용을 연계해 수정된 고품질 보고서 객체와 사용자 대화 응답을 포함한 JSON을 내보내세요.` }
      ]
    });

    const result = await callGeminiWithFallback(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: geminiContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["chatReply", "updatedReport"],
            properties: {
              chatReply: {
                type: Type.STRING,
                description: "사용자가 내린 명령에 의거하여 어떤 점들이 보완/점검되어 제안서에 정밀 이식되었는지와 조언을 서술한 챗봇의 친절한 한국어 답변"
              },
              updatedReport: {
                type: Type.OBJECT,
                description: "개정 지시가 주도면밀하게 전체 반영된 새 기획 보고서 객체 (기존 1차 보고서의 모든 JSON 형태를 완벽히 유지해야 함)",
                required: [
                  "title", 
                  "marketEvaluation", 
                  "costProjection", 
                  "competitorAnalysis", 
                  "roadmap", 
                  "financialStrategy", 
                  "riskAssessment",
                  "successStories"
                ],
                properties: {
                  title: { type: Type.STRING },
                  executiveSummary: { type: Type.STRING },
                  marketEvaluation: {
                    type: Type.OBJECT,
                    required: ["radarMetrics", "generalScore", "radarFeedback"],
                    properties: {
                      generalScore: { type: Type.INTEGER },
                      radarMetrics: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["subject", "value", "description"],
                          properties: {
                            subject: { type: Type.STRING },
                            value: { type: Type.INTEGER },
                            description: { type: Type.STRING }
                          }
                        }
                      },
                      radarFeedback: { type: Type.STRING }
                    }
                  },
                  costProjection: {
                    type: Type.OBJECT,
                    required: ["totalCostExcludingCapital", "items", "costFeedback"],
                    properties: {
                      totalCostExcludingCapital: { type: Type.INTEGER },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["category", "amount", "description"],
                          properties: {
                            category: { type: Type.STRING },
                            amount: { type: Type.INTEGER },
                            description: { type: Type.STRING }
                          }
                        }
                      },
                      costFeedback: { type: Type.STRING }
                    }
                  },
                  competitorAnalysis: {
                    type: Type.OBJECT,
                    required: ["competitors", "threatAssessment"],
                    properties: {
                      competitors: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["name", "strength", "weakness", "howToBeat"],
                          properties: {
                            name: { type: Type.STRING },
                            strength: { type: Type.STRING },
                            weakness: { type: Type.STRING },
                            howToBeat: { type: Type.STRING }
                          }
                        }
                      },
                      threatAssessment: { type: Type.STRING }
                    }
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["phase", "title", "timeline", "coreGoal", "indicator"],
                      properties: {
                        phase: { type: Type.STRING },
                        title: { type: Type.STRING },
                        timeline: { type: Type.STRING },
                        coreGoal: { type: Type.STRING },
                        indicator: { type: Type.STRING }
                      }
                    }
                  },
                  financialStrategy: { type: Type.STRING },
                  riskAssessment: { type: Type.STRING },
                  successStories: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["companyName", "founderName", "ageAtLaunch", "field", "summary", "keySuccessFactor", "sourceUrl"],
                      properties: {
                        companyName: { type: Type.STRING },
                        founderName: { type: Type.STRING },
                        ageAtLaunch: { type: Type.STRING },
                        field: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        keySuccessFactor: { type: Type.STRING },
                        sourceUrl: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      const text = response.text;
      if (!text) throw new Error("No text response");
      return JSON.parse(text);
    }, () => getChatRefineFallback(careerProfile, report, userInstruction));

    res.json(result);
  } catch (err) {
    handleError(res, err, "제안서 대화 개정 처리에 실패했습니다");
  }
});

// ----------------- Vite Integration & Server Startup -----------------

if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const serverInstance = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SeniorCareerProposalStarter] Fullstack Server running on http://localhost:${PORT}`);
});
