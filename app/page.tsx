"use client";

import { useMemo, useState } from "react";

type Choice = {
  label: string;
  ultra?: number;
  swing?: number;
  long?: number;
  safety?: number;
};

type Question = {
  number: number;
  section: string;
  prompt: string;
  helper?: string;
  choices: Choice[];
};

const questions: Question[] = [
  {
    number: 1,
    section: "操作節奏",
    prompt: "交易日裡，你真正能不被打斷的觀察時間，比較接近哪一種？",
    choices: [
      { label: "我能固定保留盤中一段時間，專心執行當日計畫。", ultra: 3 },
      { label: "我多半在收盤後看盤，每天能留 20–40 分鐘整理。", swing: 3 },
      { label: "我每週安排一次完整檢視，不想讓盤勢切碎生活。", long: 3 },
      { label: "只能用零碎空檔滑手機看，常常來不及把資訊看完整。", safety: 2 },
    ],
  },
  {
    number: 2,
    section: "操作節奏",
    prompt: "一檔你觀察中的股票，突然在盤中突破。你通常會怎麼處理？",
    choices: [
      { label: "只要符合預先寫好的觸發價與風險額度，就照計畫處理。", ultra: 3, swing: 1 },
      { label: "等收盤與量能確認，再看它是否形成可以跟隨的結構。", swing: 3 },
      { label: "除非它改變我的長期配置判斷，否則不會因一天的突破改動。", long: 3 },
      { label: "先追一點再說，最怕錯過這種突然出現的機會。", safety: 3 },
    ],
  },
  {
    number: 3,
    section: "操作節奏",
    prompt: "進場之前，哪一種準備最能讓你安心？",
    choices: [
      { label: "寫清楚觸發價、出場點與單筆最大損失。", ultra: 3, swing: 1 },
      { label: "確認趨勢、相對強弱與這段行情可以等待多久。", swing: 3 },
      { label: "看企業邏輯、估值與資產配置，而非短期價格位置。", long: 3 },
      { label: "先聽到一個很有說服力的消息，再決定要不要買。", safety: 3 },
    ],
  },
  {
    number: 4,
    section: "操作節奏",
    prompt: "持有後出現回檔時，哪一種狀況最容易讓你做出好判斷？",
    choices: [
      { label: "我能依當日價格行為與失效點，快速處理不符合預期的部位。", ultra: 3 },
      { label: "我願意給一段趨勢時間，但會在結構走壞時減碼。", swing: 3 },
      { label: "我能承受一段波動，只在長期理由或配置失衡時調整。", long: 3 },
      { label: "只要帳面變紅，就很難不一直想把它處理掉。", safety: 3 },
    ],
  },
  {
    number: 5,
    section: "操作節奏",
    prompt: "一筆部位已經有一段獲利時，你比較像哪一種人？",
    choices: [
      { label: "按原訂的短期出場規則收斂，不讓盤中獲利變成臨場貪念。", ultra: 3 },
      { label: "調整停利或部位，讓趨勢有空間繼續走。", swing: 3 },
      { label: "只要長期假設未改變，會讓資產在配置裡持續工作。", long: 3 },
      { label: "通常沒有計畫；看到別人怎麼說，才決定要賣還是加碼。", safety: 3 },
    ],
  },
  {
    number: 6,
    section: "心理與決策",
    prompt: "價格碰到你原先設定的失效點時，你最常做的是？",
    choices: [
      { label: "先退出；下一次是否進場，必須是另一個新的條件。", ultra: 3, swing: 1 },
      { label: "確認收盤結構後，照減碼或出場的規則執行。", swing: 3 },
      { label: "回到長期假設與配置比例，不把短期跌幅直接等同於看錯。", long: 3 },
      { label: "把停損再往下挪，等它回到成本附近再說。", safety: 4 },
    ],
  },
  {
    number: 7,
    section: "心理與決策",
    prompt: "當社群、朋友與新聞都在談同一檔股票，你的第一步是？",
    choices: [
      { label: "只核對它有沒有符合我的短期交易條件，不讓討論本身變成訊號。", ultra: 3 },
      { label: "先加入觀察名單，等待市場結構與題材強度更清楚。", swing: 3 },
      { label: "先判斷它是否符合長期篩選標準；熱門不是配置理由。", long: 3 },
      { label: "討論越熱，我越覺得自己不能缺席。", safety: 3 },
    ],
  },
  {
    number: 8,
    section: "心理與決策",
    prompt: "連續兩筆交易不如預期後，你下一個動作通常是？",
    choices: [
      { label: "停下來回看執行紀錄，確認是系統問題還是自己沒照規則。", ultra: 3 },
      { label: "降低頻率與部位，等下一個完整的趨勢設定。", swing: 3 },
      { label: "重看長期假設與整體配置，不會用更多交易追回損失。", long: 3 },
      { label: "想快點做下一筆，而且常會把部位放大。", safety: 4 },
    ],
  },
  {
    number: 9,
    section: "心理與決策",
    prompt: "持倉波動加大時，哪一種描述最接近你的夜晚？",
    choices: [
      { label: "我已設好風險界線；盤後看完必要資料，就能離開螢幕。", ultra: 3 },
      { label: "我會看一次收盤與趨勢位置，但不需要反覆確認。", swing: 3 },
      { label: "只要資產配置仍合理，不會因一兩天的波動影響作息。", long: 3 },
      { label: "腦中會一直重播價格，睡眠、工作或關係都可能被影響。", safety: 4 },
    ],
  },
  {
    number: 10,
    section: "心理與決策",
    prompt: "回顧一筆交易時，你最重視留下哪一種答案？",
    choices: [
      { label: "我是否照進、出場流程執行，而不只看最後賺或賠。", ultra: 3 },
      { label: "我是否讀對趨勢與節奏，哪個確認環節需要修正。", swing: 3 },
      { label: "原先的長期假設是否仍成立，配置是否需要調整。", long: 3 },
      { label: "只想知道消息、別人或運氣為什麼沒有站在我這邊。", safety: 3 },
    ],
  },
  {
    number: 11,
    section: "資源與安全門檻",
    prompt: "你預計投入市場的資金，目前最接近哪一種來源？",
    choices: [
      { label: "專門劃分的操作資金，單筆風險與總額都有上限。", ultra: 2, swing: 1 },
      { label: "閒置資金的一部分，已有清楚的部位比例與持有期限。", swing: 3 },
      { label: "以三年以上的資產目標為主，近期沒有動用壓力。", long: 3 },
      { label: "一年內可能要用，或虧損會立刻影響生活與關係。", safety: 5 },
    ],
  },
  {
    number: 12,
    section: "資源與安全門檻",
    prompt: "面對融資、槓桿或借來的錢，你現在的做法是？",
    choices: [
      { label: "不使用槓桿，並用部位大小讓停損落在可承受範圍。", ultra: 2 },
      { label: "以現金操作，每一種設定都有固定的單筆比例。", swing: 3 },
      { label: "維持長期配置，不因短期機會改變整體風險水位。", long: 3 },
      { label: "覺得不用槓桿或借力，就很難把機會做大。", safety: 5 },
    ],
  },
  {
    number: 13,
    section: "資源與安全門檻",
    prompt: "你現在用哪種方式，確認自己不是憑感覺在操作？",
    choices: [
      { label: "每次記下進場、失效點與出場，之後能回放執行過程。", ultra: 3 },
      { label: "固定週末整理趨勢、持倉與下一週的觀察清單。", swing: 3 },
      { label: "持續更新長期投資筆記，記錄持有理由與配置變化。", long: 3 },
      { label: "大多靠記憶和當下感覺，事後很難重建自己怎麼決定。", safety: 4 },
    ],
  },
  {
    number: 14,
    section: "資源與安全門檻",
    prompt: "當你睡眠不足、和人衝突或情緒很滿時，你會怎麼處理市場？",
    choices: [
      { label: "取消當日新交易，等自己能平穩回到既定流程。", ultra: 3 },
      { label: "不開新部位，最多做收盤觀察與紀錄。", swing: 3 },
      { label: "暫緩任何再平衡，等原訂檢視時間再回來判斷。", long: 3 },
      { label: "反而更想靠交易把焦慮、空虛或挫折壓下去。", safety: 5 },
    ],
  },
  {
    number: 15,
    section: "資源與安全門檻",
    prompt: "現在的你，最希望股票操作替你完成什麼？",
    choices: [
      { label: "用小風險測試一套能反覆執行的短期流程。", ultra: 3 },
      { label: "找到能跟隨一段趨勢、又不必整天盯盤的方法。", swing: 3 },
      { label: "讓資產有時間參與長期成長，而不是天天證明自己。", long: 3 },
      { label: "盡快翻過眼前的財務缺口、壓力或挫折感。", safety: 5 },
    ],
  },
];

const lifePathNotes: Record<number, string> = {
  1: "你較容易想主動掌握節奏；優勢是果斷，提醒是先確認再出手。",
  2: "你對關係與外部訊號敏感；提醒是把別人的意見和自己的規則分開。",
  3: "你容易被情緒與機會感帶動；提醒是把興奮感放進規則，而不是放進部位。",
  4: "你重視結構與秩序；優勢是能守流程，提醒是別把僵化當作紀律。",
  5: "你對變化與自由有感；提醒是讓探索有上限，別讓新鮮感取代判斷。",
  6: "你重視責任與照顧；提醒是不必用一筆交易證明自己能扛一切。",
  7: "你習慣研究與思考；提醒是資訊夠用後，要有明確的行動與退出條件。",
  8: "你對成果與掌控感敏感；提醒是把勝負欲放在流程品質，而不是單筆結果。",
  9: "你重視意義與全局；提醒是遠見仍需要具體的風險界線。",
  11: "你對訊號與壓力的感受很強；提醒是先安定，再把直覺交給可驗證的規則。",
  22: "你有把大方向落地的傾向；提醒是分段承擔，不必一次把所有判斷壓上去。",
};

function getLifePath(value: string) {
  const digits = value.replace(/\D/g, "").split("").map(Number);
  if (!digits.length) return null;
  let sum = digits.reduce((total, digit) => total + digit, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0);
  }
  return sum;
}

function addScores(score: Record<string, number>, choice: Choice) {
  score.ultra += choice.ultra ?? 0;
  score.swing += choice.swing ?? 0;
  score.long += choice.long ?? 0;
  score.safety += choice.safety ?? 0;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const lifePath = getLifePath(birthdate);
  const currentQuestion = activeQuestion === null ? null : questions[activeQuestion];
  const progress = activeQuestion === null ? 0 : Math.round((activeQuestion / questions.length) * 100);

  const result = useMemo(() => {
    const score = { ultra: 0, swing: 0, long: 0, safety: 0 };
    questions.forEach((question) => {
      const answer = answers[question.number];
      if (answer !== undefined) addScores(score, question.choices[answer]);
    });

    const styles = [
      { key: "ultra", label: "超短線操作", detail: "幾天到兩週，以明確觸發、快速風控與盤中／盤後紀律為主。" },
      { key: "swing", label: "波段操作", detail: "兩週到兩個月，以趨勢確認、耐心等待與時間停損為主。" },
      { key: "long", label: "長期持有", detail: "數月以上，以長期邏輯、配置耐心與降低短期雜訊為主。" },
    ] as const;

    const best = [...styles].sort((a, b) => score[b.key] - score[a.key])[0];
    const gated = score.safety >= 7 || [11, 12, 15].some((number) => answers[number] === 3);
    return { score, best, gated };
  }, [answers]);

  function startAssessment() {
    setStarted(true);
    setActiveQuestion(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(choiceIndex: number) {
    if (activeQuestion === null || transitioning) return;
    const questionNumber = questions[activeQuestion].number;
    setAnswers((current) => ({ ...current, [questionNumber]: choiceIndex }));
    setTransitioning(true);

    window.setTimeout(() => {
      if (activeQuestion === questions.length - 1) {
        setShowResult(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setActiveQuestion((current) => (current === null ? 0 : current + 1));
      }
      setTransitioning(false);
    }, 240);
  }

  function goBack() {
    if (activeQuestion === null) return;
    if (activeQuestion === 0) setActiveQuestion(null);
    else setActiveQuestion(activeQuestion - 1);
  }

  function restart() {
    setStarted(false);
    setBirthdate("");
    setAnswers({});
    setActiveQuestion(null);
    setShowResult(false);
    setTransitioning(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <section className="hero-shell">
        <nav className="top-nav" aria-label="主要導覽">
          <div className="brand-mark"><span>NAS</span><small>NOAGE SPACE</small></div>
          <div className="nav-note">操作節奏適配掃描 <i>01</i></div>
        </nav>

        {!started ? (
          <div className="hero-content">
            <div className="eyebrow"><span />個人操作適配測驗</div>
            <h1>不是每一種方法，<br />都適合你的<span>決策節奏</span>。</h1>
            <p className="hero-copy">用 15 個具體情境，看見你在波動、等待與壓力下如何做決定；找出現在更能承接的操作方式。</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={startAssessment}>開始 6 分鐘掃描 <b>→</b></button>
              <p>不蒐集帳戶資料 · 不推薦標的 · 結果僅供自我覺察與風險管理</p>
            </div>
            <div className="hero-matrix" aria-hidden="true"><span>READ<br />THE<br />PATTERN</span><i /><b /><em /></div>
          </div>
        ) : (
          <section className="assessment-layout" aria-label="操作適配問卷">
            <aside className="assessment-sidebar">
              <div className="eyebrow"><span />操作節奏適配掃描</div>
              <h2>先看清楚，<br />你怎麼決定。</h2>
              <p>這不是人格標籤，也不是投資建議；它看的是你此刻的操作條件與壓力反應。</p>
              <div className="method-list">
                <div className={activeQuestion !== null && activeQuestion < 5 ? "is-current" : ""}><em>01</em><span>操作節奏<small>時間、等待與持有週期</small></span></div>
                <div className={activeQuestion !== null && activeQuestion >= 5 && activeQuestion < 10 ? "is-current" : ""}><em>02</em><span>心理與決策<small>停損、跟風與壓力反應</small></span></div>
                <div className={activeQuestion !== null && activeQuestion >= 10 ? "is-current" : ""}><em>03</em><span>資源與安全<small>資金用途、紀律與生活穩定度</small></span></div>
              </div>
              <div className="sidebar-disclaimer">請以「過去三個月的真實狀態」作答，不選理想中的自己。</div>
            </aside>

            <div className="question-panel">
              {!showResult ? (
                activeQuestion === null ? (
                  <section className="profile-screen">
                    <div className="progress-header"><div><strong>準備</strong><span> / 15 題</span></div><div className="progress-track"><span style={{ width: "0%" }} /></div></div>
                    <div className="profile-copy"><span className="question-index">開始前</span><h3>先留下你的出生日期。</h3><p>生命數字只會放在結果中，作為理解慣性的另一面鏡子；它不會替你決定任何操作方式。</p></div>
                    <label className="date-field"><span>出生日期</span><input type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} aria-label="出生日期" /></label>
                    {lifePath && <div className="life-path-badge"><span>你的生命數字</span><b>{lifePath}</b></div>}
                    <button className="primary-button profile-button" disabled={!birthdate} onClick={() => setActiveQuestion(0)}>開始第 1 題 <b>→</b></button>
                  </section>
                ) : currentQuestion && (
                  <section className="single-question" key={currentQuestion.number} aria-live="polite">
                    <div className="progress-header"><div><strong>{String(activeQuestion + 1).padStart(2, "0")}</strong><span> / {questions.length} 題</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
                    <div className="question-card">
                      <div className="question-meta"><span>{String(currentQuestion.number).padStart(2, "0")}</span><small>{currentQuestion.section}</small></div>
                      <h3>{currentQuestion.prompt}</h3>
                      {currentQuestion.helper && <p className="question-helper">{currentQuestion.helper}</p>}
                      <div className="choice-list">
                        {currentQuestion.choices.map((choice, index) => {
                          const active = answers[currentQuestion.number] === index;
                          return <button className={`choice ${active ? "is-active" : ""} ${transitioning && active ? "is-picking" : ""}`} key={choice.label} onClick={() => chooseAnswer(index)} aria-pressed={active} disabled={transitioning}>
                            <span>{String.fromCharCode(65 + index)}</span>{choice.label}
                          </button>;
                        })}
                      </div>
                    </div>
                    <button className="back-button" onClick={goBack}>← {activeQuestion === 0 ? "回到設定" : "上一題"}</button>
                    <p className="auto-note">選定答案後，系統會自動帶你前往下一題。</p>
                  </section>
                )
              ) : (
                <section className="result-panel" aria-live="polite">
                  <div className="result-topline"><span>你的掃描結果</span><button onClick={restart}>重新填寫</button></div>
                  <div className="result-hero"><p>目前操作適配</p><h2>{result.gated ? "先建立規則，再談操作週期" : result.best.label}</h2><div className="result-rule" /><p className="result-lede">{result.gated ? "你不是不適合市場；現在更需要先處理的，是資金用途、情緒壓力或紀律條件。先把風險界線建好，才不會用交易處理生活焦慮。" : result.best.detail}</p></div>
                  <div className="result-grid"><article><span>你的節奏優勢</span><h3>{result.gated ? "先把「不交易」變成一個有效選項" : result.best.label === "超短線操作" ? "能在規則清楚時快速處理訊號" : result.best.label === "波段操作" ? "能讓確認與耐心一起工作" : "能把短期雜訊留在決策之外"}</h3></article><article><span>現在的關鍵提醒</span><h3>{result.gated ? "不要用近期會動用的錢、槓桿或情緒壓力，逼自己立刻翻身。" : "再適合的週期，也必須先寫下失效條件與部位上限。"}</h3></article></div>
                  <section className="operating-card"><div className="operating-card-head"><span>下一步，不是多做；是先守住。</span><i>OPERATING NOTE</i></div><div className="rule-content"><div><small>你本週的唯一原則</small><p>{result.gated ? "任何需要用交易證明自己、補回壓力或挽回損失的時候，都不開新倉。" : result.best.label === "超短線操作" ? "沒有事先寫好觸發與失效點，就不因盤中波動臨時出手。" : result.best.label === "波段操作" ? "沒有趨勢確認與時間停損，就不把等待誤當成耐心。" : "沒有回到長期理由與配置上限，就不因單日波動大幅調整。"}</p></div><div><small>生命數字的提醒</small><p>{lifePathNotes[lifePath ?? 1]}</p></div></div></section>
                  <section className="result-disclaimer"><strong>閱讀這份結果前，請記得：</strong>這是自我覺察與風險管理工具，不構成個別投資建議、招攬或報酬承諾。超短線與頻繁交易需要足夠的經驗、時間、資源與風險承受能力；若你的資金近期要用、沒有風控紀錄，或交易已影響生活，現金與觀察都是有效選項。</section>
                </section>
              )}
            </div>
          </section>
        )}
      </section>
      <footer><span>NAS · 操作節奏適配掃描</span><span>數字是理解自己的工具，不是限制你的答案。</span></footer>
    </main>
  );
}
