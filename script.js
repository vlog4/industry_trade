/* ==========================================================
   대한민국 산업통상자원부 (MOTIE) 대국민 인터랙션 스크립트
   - 순수 바닐라 JavaScript (빌드/라이브러리/서버 의존성 없음)
   - 주요 탭 전환, 퀴즈 팩트체크, 최신 뉴스 필터링 기능
========================================================== */

// 1. 최신 뉴스 및 정책 보도자료 데이터베이스
const MOTIE_NEWS_DATA = [
  {
    id: 1,
    category: "trade",
    categoryLabel: "수출·통상",
    title: "글로벌 빅바이어 530개사 참여 '수출 붐업코리아' 개막",
    snippet: "산업통상자원부는 KOTRA와 함께 해외 유력 바이어를 대거 유치하여 국내 수출기업들의 대규모 수출 계약 및 판로 개척을 총력 지원합니다.",
    date: "2026.10",
    url: "https://www.motie.go.kr"
  },
  {
    id: 2,
    category: "energy",
    categoryLabel: "에너지·원전",
    title: "체코 원전 본계약 지원 및 한-체코 에너지 전방위 협력 가속",
    snippet: "두코바니 신규 원전 후속 조치를 차질 없이 완수하고 양국 간 소형모듈원자로(SMR), 산업 연구개발(R&D) 등 청정에너지 협력을 확대합니다.",
    date: "2026.10",
    url: "https://www.motie.go.kr"
  },
  {
    id: 3,
    category: "industry",
    categoryLabel: "산업·AI",
    title: "K-반도체 글로벌 초격차 유지 및 메가 클러스터 속도전",
    snippet: "용인·평택 반도체 메가 클러스터의 전력·용수 공급 및 인허가 절차를 단축하고 첨단 패키징 R&D 생태계를 집중 육성합니다.",
    date: "2026.10",
    url: "https://www.motie.go.kr"
  },
  {
    id: 4,
    category: "trade",
    categoryLabel: "무역금융",
    title: "중동 플랜트 및 대형 인프라 수주 확대를 위한 민관 원팀 가동",
    snippet: "고위급 수주 지원단 파견 및 정책금융 지원을 연계하여 탈탄소 플랜트, 신재생 에너지 수주를 가시화합니다.",
    date: "2026.09",
    url: "https://www.korea.kr"
  },
  {
    id: 5,
    category: "industry",
    categoryLabel: "제조혁신",
    title: "제조업 전반의 AI 전환(AX) 가속화 및 스마트팩토리 고도화",
    snippet: "뿌리산업 및 중소·중견 제조 현장에 인공지능 자율제조 시스템을 도입하여 산업 생산성을 획기적으로 개선합니다.",
    date: "2026.09",
    url: "https://www.motie.go.kr"
  },
  {
    id: 6,
    category: "energy",
    categoryLabel: "에너지믹스",
    title: "무탄소에너지(CFE) 이니셔티브 글로벌 확산 및 재생에너지 보급",
    snippet: "원전, 수소, 재생에너지를 아우르는 탄소 감축 생태계를 구축하고 기업의 무탄소 전력 사용 확대를 제도적으로 뒷받침합니다.",
    date: "2026.08",
    url: "https://www.korea.kr"
  }
];

// 2. 알기 쉬운 대국민 퀴즈 데이터
const QUIZ_DATA = [
  {
    question: "Q1. 산업통상자원부(MOTIE)의 영문 약자에서 'T'가 뜻하는 단어는 무엇일까요?",
    options: ["Technology (기술)", "Trade (무역·통상)", "Transport (교통)", "Taxation (세무)"],
    correctIndex: 1,
    explanation: "정답입니다! MOTIE는 Ministry of Trade, Industry and Energy의 약자로 'Trade(무역·통상)'를 총괄합니다."
  },
  {
    question: "Q2. 산업통상자원부가 육성하는 국가 첨단 전략산업 분야가 아닌 것은?",
    options: ["반도체", "이차전지 (배터리)", "가상자산(코인) 거래소 운영", "미래 모빌리티(친환경차)"],
    correctIndex: 2,
    explanation: "정답입니다! 반도체, 이차전지, 바이오, 미래차 등 국가 핵심 기술과 수출 주력 산업 육성이 산업통상자원부의 핵심 임무입니다."
  },
  {
    question: "Q3. 탄소중립과 안정적 전력 공급을 위해 산업부가 조화롭게 추진하는 에너지 정책은?",
    options: ["원전과 재생에너지, 청정수소의 균형 있는 '에너지 믹스'", "화석연료만 100% 사용", "전기 생산 전면 축소", "모든 발전소 일괄 폐쇄"],
    correctIndex: 0,
    explanation: "정답입니다! 산업통상자원부는 24시간 끊김 없는 에너지 안보와 지속 가능한 무탄소 녹색전환을 위해 에너지 믹스를 고도화하고 있습니다."
  }
];

let currentQuizIndex = 0;

// DOM 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderNews("all");
  initNewsFilter();
  loadQuiz(0);
  initDiagnostic();
});

// 탭 전환 기능
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add("active");
      }
    });
  });
}

// 뉴스 렌더링
function renderNews(filterCategory) {
  const newsGrid = document.getElementById("newsGrid");
  if (!newsGrid) return;

  const filtered = filterCategory === "all" 
    ? MOTIE_NEWS_DATA 
    : MOTIE_NEWS_DATA.filter(item => item.category === filterCategory);

  newsGrid.innerHTML = filtered.map(news => `
    <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="news-card">
      <div class="news-badge-wrap">
        <span class="news-cat">${news.categoryLabel}</span>
        <span class="news-date">${news.date}</span>
      </div>
      <div class="news-body">
        <h4 class="news-title">${news.title}</h4>
        <p class="news-snippet">${news.snippet}</p>
        <span class="news-link-text">보도자료 원문 보기 ➔</span>
      </div>
    </a>
  `).join("");
}

// 뉴스 필터 버튼 이벤트
function initNewsFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderNews(filter);
    });
  });
}

// 퀴즈 기능
function loadQuiz(index) {
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextQuizBtn");

  if (!questionEl || !optionsEl) return;

  const quiz = QUIZ_DATA[index];
  questionEl.textContent = quiz.question;
  feedbackEl.style.display = "none";
  feedbackEl.className = "quiz-feedback";
  nextBtn.style.display = "none";

  optionsEl.innerHTML = "";
  quiz.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt-btn";
    btn.textContent = optText;
    btn.addEventListener("click", () => checkAnswer(i, quiz, btn));
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selectedIndex, quiz, selectedBtn) {
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextQuizBtn");
  const buttons = optionsEl.querySelectorAll(".quiz-opt-btn");

  // 버튼 비활성화
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === quiz.correctIndex) {
    selectedBtn.classList.add("correct");
    feedbackEl.textContent = "🎉 " + quiz.explanation;
    feedbackEl.className = "quiz-feedback show-correct";
  } else {
    selectedBtn.classList.add("wrong");
    buttons[quiz.correctIndex].classList.add("correct");
    feedbackEl.textContent = `❌ 아쉬워요! 정답은 '${quiz.options[quiz.correctIndex]}' 입니다. ` + quiz.explanation;
    feedbackEl.className = "quiz-feedback show-wrong";
  }

  feedbackEl.style.display = "block";

  if (currentQuizIndex < QUIZ_DATA.length - 1) {
    nextBtn.textContent = "다음 문제 풀기 ➔";
    nextBtn.style.display = "inline-block";
    nextBtn.onclick = () => {
      currentQuizIndex++;
      loadQuiz(currentQuizIndex);
    };
  } else {
    nextBtn.textContent = "처음부터 다시 풀기 🔄";
    nextBtn.style.display = "inline-block";
    nextBtn.onclick = () => {
      currentQuizIndex = 0;
      loadQuiz(0);
    };
  }
}

/* ==========================================================
   3. 맞춤형 혜택 진단기 (체크리스트 & 설문 데이터 및 로직)
========================================================== */

const DIAGNOSTIC_DATA = {
  // 1) 일반 국민 · 가정
  citizen: {
    title: "일반 국민 및 가정을 위한 맞춤 정책 지원",
    items: [
      { id: "c1", label: "전기·가스요금 절약 및 에너지 캐시백 환급에 관심이 있어요." },
      { id: "c2", label: "에너지 취약계층 동·하절기 에너지바우처 지원 대상인지 알고 싶어요." },
      { id: "c3", label: "가정용 고효율 가전제품 구매 시 환급 혜택을 받고 싶어요." },
      { id: "c4", label: "주택 태양광(미니태양광) 설치 및 신재생에너지 보조금을 찾고 있어요." },
      { id: "c5", label: "어린이용품, 전자제품의 KC 안전인증 및 위해제품 리콜 정보가 궁금해요." }
    ],
    programs: {
      c1: {
        tag: "요금 환급",
        name: "주택용 에너지캐시백 지원 사업",
        desc: "과거 2개년 동월 평균 대비 전기 사용량을 3% 이상 절감할 경우, 절감률에 따라 kWh당 최대 100원까지 현금성 캐시백으로 돌려받는 국민 혜택입니다.",
        dept: "산업통상자원부 전력정책관실 / 한국전력공사",
        link: "https://en-ter.co.kr"
      },
      c2: {
        tag: "복지 바우처",
        name: "에너지바우처 지원 제도",
        desc: "기초생활수급가구 중 노인·영유아·장애인·임산부 등을 대상으로 여름철 냉방(전기요금)과 겨울철 난방(전기, 도시가스, 등유, 연탄 등) 비용을 직접 지원합니다.",
        dept: "산업통상자원부 자원산업정책국 / 한국에너지공단",
        link: "https://www.energyv.or.kr"
      },
      c3: {
        tag: "가전 환급",
        name: "으뜸효율 가전제품 구매비용 환급",
        desc: "에너지소비효율 1등급 가전제품(에어컨, 냉장고, 세탁기 등) 구매 시 구매 비용의 10%~20%(가구당 한도 내)를 환급해 드립니다.",
        dept: "산업통상자원부 에너지효율과 / 한국에너지공단",
        link: "https://rebate.energy.or.kr"
      },
      c4: {
        tag: "설치 보조금",
        name: "신재생에너지 주택지원사업 (그린홈)",
        desc: "단독·공동주택에 태양광, 태양열, 지열 등 신재생에너지 설비를 설치할 때 정부와 지자체가 설치비의 최대 50% 수준을 무상 보조합니다.",
        dept: "산업통상자원부 재생에너지정책과 / 한국에너지공단",
        link: "https://greenhome.kemco.or.kr"
      },
      c5: {
        tag: "제품 안전",
        name: "제품안전정보센터 (KC인증 및 리콜 확인)",
        desc: "어린이 완구, 전자기기 등 일상용품의 국가기술표준원 안전기준 충족 여부와 결함 보상·리콜 현황을 실시간 조회할 수 있습니다.",
        dept: "산업통상자원부 국가기술표준원",
        link: "https://www.safetykorea.kr"
      }
    }
  },

  // 2) 취업준비생 · 이공계 청년
  youth: {
    title: "청년 구직자 및 이공계 인재를 위한 맞춤 지원",
    items: [
      { id: "y1", label: "반도체·배터리 등 첨단산업 분야의 무료 실무 부트캠프를 찾고 있어요." },
      { id: "y2", label: "수출 기업 및 해외 주재원, 글로벌 무역 전문 인력(GTEP)으로 성장하고 싶어요." },
      { id: "y3", label: "산업통상자원부 산하 공공기관(한전, KOTRA, 가스공사 등) 채용 정보가 필요해요." },
      { id: "y4", label: "제조 AI(AX) 및 스마트공장 데이터 분석 전문가 양성 과정에 참여하고 싶어요." }
    ],
    programs: {
      y1: {
        tag: "첨단 인재양성",
        name: "첨단산업 특성화대학원 및 국가첨단전략산업 부트캠프",
        desc: "반도체, 배터리, 바이오 분야에서 산학 연계 실습, 전액 국비 장학금 및 산업체 멘토링을 통해 대기업·중견기업 취업을 직접 연계합니다.",
        dept: "산업통상자원부 산업인력과 / 한국산업기술진흥원(KIAT)",
        link: "https://www.kiat.or.kr"
      },
      y2: {
        tag: "청년 무역인력",
        name: "지역특화 청년무역전문가양성사업 (GTEP)",
        desc: "전국 대학생을 대상으로 무역 실무, 전자상거래, 해외 전시회 직접 참가 기회를 제공하여 글로벌 비즈니스 전문가로 육성합니다.",
        dept: "산업통상자원부 무역진흥과 / 한국무역협회(KITA)",
        link: "https://www.kita.net"
      },
      y3: {
        tag: "공공기관 채용",
        name: "산업통상자원 산하 공공기관 합동 채용박람회",
        desc: "한국전력, KOTRA, 한국수력원자력, 한국무역보험공사 등 40여 개 에너지·산업 공공기관의 공식 채용 정보와 멘토링을 통합 제공합니다.",
        dept: "산업통상자원부 혁신행정담당관",
        link: "https://www.motie.go.kr"
      },
      y4: {
        tag: "제조 AI 혁신",
        name: "산업 AX(AI전환) 융합 전문인력 양성",
        desc: "기계·철강·전자 등 제조 도메인 지식과 인공지능/빅데이터 기술을 결합하여 스마트공장 디지털 전환을 이끌 인재를 육성합니다.",
        dept: "산업통상자원부 AI산업정책관",
        link: "https://www.kiat.or.kr"
      }
    }
  },

  // 3) 수출 기업 · 소상공인
  business: {
    title: "수출 기업 및 소상공인을 위한 맞춤 비즈니스 혜택",
    items: [
      { id: "b1", label: "해외 바이어를 발굴하고 글로벌 전시회 참가 부스 비용을 지원받고 싶어요." },
      { id: "b2", label: "수출 대금 미회수 위험을 방지하고 무역보험·수출금융 특례를 받고 싶어요." },
      { id: "b3", label: "해외 통상 규제(미국 IRA, EU 탄소국경세 CBAM 등) 대응 컨설팅이 절실해요." },
      { id: "b4", label: "에너지 고효율 설비(냉난방기, 컴프레서) 교체비용 70% 지원을 받고 싶어요." }
    ],
    programs: {
      b1: {
        tag: "수출 바우처",
        name: "수출바우처 및 수출 붐업코리아 매칭 지원",
        desc: "기업이 원하는 해외 마케팅, 통번역, 해외 규격 인증, 물류비 등을 바우처 형태로 자유롭게 선택해 최대 1억 원 한도로 지원합니다.",
        dept: "산업통상자원부 무역진흥과 / KOTRA",
        link: "https://www.exportvoucher.com"
      },
      b2: {
        tag: "무역 금융",
        name: "중소·중견 수출신용보증 및 단기수출보험",
        desc: "해외 바이어의 대금 미지급 손실을 보상하고, 시중은행을 통한 저금리 수출 제작자금 대출 보증서를 발급해 드립니다.",
        dept: "산업통상자원부 무역정책과 / 한국무역보험공사(K-SURE)",
        link: "https://www.ksure.or.kr"
      },
      b3: {
        tag: "통상 규제대응",
        name: "통상바우처 & 탄소통상(CBAM) 1:1 맞춤 컨설팅",
        desc: "급변하는 EU 탄소국경조정제도 및 글로벌 무역장벽에 대응할 수 있도록 탄소배출량 산정 및 서류 작성 컨설팅 비용을 지원합니다.",
        dept: "산업통상자원부 통상협력국 / 한국무역협회",
        link: "https://www.kita.net"
      },
      b4: {
        tag: "소상공인 지원",
        name: "소상공인·중소기업 고효율 기기 설치 지원사업",
        desc: "식당, 카페, 매장 등의 노후 냉난방기, 수직형 쇼케이스 등을 1등급 고효율 기기로 교체할 때 구매 비용의 최대 70%를 지원합니다.",
        dept: "산업통상자원부 에너지효율과 / 한국에너지공단",
        link: "https://eep.energy.or.kr"
      }
    }
  },

  // 4) 첨단 제조 · R&D 기업
  tech: {
    title: "첨단 제조 및 연구개발(R&D) 기업 지원",
    items: [
      { id: "t1", label: "반도체·디스플레이·배터리 등 국가첨단전략기술 지정을 받고 인허가 특례를 원해요." },
      { id: "t2", label: "산업부-중기부 통합 대규모 기술개발(R&D) 출연금 과제에 참여하고 싶어요." },
      { id: "t3", label: "공급망 핵심 소부장(소재·부품·장비) 으뜸기업 선정 및 기술 자립을 희망해요." },
      { id: "t4", label: "공장에 AI 기반 자율제조 및 스마트공장 솔루션을 도입하고 싶어요." }
    ],
    programs: {
      t1: {
        tag: "국가첨단전략기술",
        name: "국가첨단전략산업 특화단지 인프라 및 세제 혜택",
        desc: "용인 반도체 등 특화단지 입주 기업에 전력·용수 인프라 우선 구축, 용적률 상향, 시설투자 세액공제(K-칩스법)를 집중 지원합니다.",
        dept: "산업통상자원부 첨단산업정책관",
        link: "https://www.motie.go.kr"
      },
      t2: {
        tag: "기술개발 R&D",
        name: "산업기술 R&D 혁신펀드 및 기술개발 과제 지원",
        desc: "연간 13조 원 규모의 산업부 기술개발 예산을 바탕으로 미래 신산업 및 초격차 기술 개발 연구비를 정부 출연금으로 매칭합니다.",
        dept: "산업통상자원부 산업기술융합정책관 / KEIT",
        link: "https://www.keit.re.kr"
      },
      t3: {
        tag: "소부장 자립화",
        name: "소부장 으뜸기업 육성 및 공급망 안정화 기금",
        desc: "소재·부품·장비 분야에서 글로벌 최고 수준의 기술력을 가진 선도기업을 선정하여 5년간 최대 250억 원의 전용 R&D를 지원합니다.",
        dept: "산업통상자원부 산업공급망정책관",
        link: "https://www.kiat.or.kr"
      },
      t4: {
        tag: "제조 AI",
        name: "M.AX (제조 AI 전환) 자율제조 선도 프로젝트",
        desc: "인공지능을 생산 공정에 접목해 불량률을 획기적으로 낮추고 탄소 배출을 줄이는 자율제조 시스템 구축 비용을 지원합니다.",
        dept: "산업통상자원부 제조산업정책관",
        link: "https://www.motie.go.kr"
      }
    }
  }
};

let currentPersona = "citizen";

function initDiagnostic() {
  const personaChips = document.querySelectorAll("#personaChips .chip-btn");
  const btnDiagnose = document.getElementById("btnDiagnose");

  // 1) 페르소나 변경 시 체크리스트 재구성
  personaChips.forEach(chip => {
    chip.addEventListener("click", () => {
      personaChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentPersona = chip.getAttribute("data-persona");
      renderChecklist(currentPersona);

      // 결과 영역 닫기
      const resultCard = document.getElementById("diagResultCard");
      if (resultCard) resultCard.style.display = "none";
    });
  });

  // 초기 체크리스트 렌더링
  renderChecklist("citizen");

  // 2) 진단 실행 버튼 클릭
  if (btnDiagnose) {
    btnDiagnose.addEventListener("click", runDiagnostic);
  }
}

function renderChecklist(personaKey) {
  const container = document.getElementById("interestChecklist");
  if (!container) return;

  const data = DIAGNOSTIC_DATA[personaKey];
  container.innerHTML = data.items.map((item, idx) => `
    <label class="check-item">
      <input type="checkbox" value="${item.id}" ${idx === 0 ? "checked" : ""}>
      <span class="check-label">${item.label}</span>
    </label>
  `).join("");
}

function runDiagnostic() {
  const container = document.getElementById("interestChecklist");
  const resultCard = document.getElementById("diagResultCard");
  const programsList = document.getElementById("resultProgramsList");
  const resultTitle = document.getElementById("resultTitle");

  if (!container || !resultCard || !programsList) return;

  const checkedInputs = container.querySelectorAll("input[type='checkbox']:checked");
  const checkedIds = Array.from(checkedInputs).map(cb => cb.value);

  const personaData = DIAGNOSTIC_DATA[currentPersona];
  resultTitle.textContent = personaData.title;

  let matchedPrograms = [];

  if (checkedIds.length === 0) {
    // 체크를 하나도 안 한 경우 페르소나의 전체 대표 프로그램을 추천
    matchedPrograms = Object.values(personaData.programs);
  } else {
    // 체크한 항목에 매칭되는 프로그램 수집
    checkedIds.forEach(id => {
      if (personaData.programs[id]) {
        matchedPrograms.push(personaData.programs[id]);
      }
    });
  }

  // 중복 제거
  matchedPrograms = Array.from(new Set(matchedPrograms));

  // 결과 HTML 생성
  programsList.innerHTML = matchedPrograms.map(prog => `
    <div class="program-card">
      <div class="program-info">
        <span class="prog-tag">${prog.tag}</span>
        <h4 class="prog-name">${prog.name}</h4>
        <p class="prog-desc">${prog.desc}</p>
        <span class="prog-dept">담당 부서/기관: ${prog.dept}</span>
      </div>
      <a href="${prog.link}" target="_blank" rel="noopener noreferrer" class="prog-btn">
        상세 공고 및 신청 ↗
      </a>
    </div>
  `).join("");

  resultCard.style.display = "block";

  // 스무스 스크롤 이동
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
