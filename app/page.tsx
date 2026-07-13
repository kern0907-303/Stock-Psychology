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
    prompt: "盤中價格突然急拉急殺時，你最自然的第一反應是？",
    choices: [
      { label: "依照事先設定的條件，快速決定進、出或等待", ultra: 3, swing: 1 },
      { label: "先等收盤或下一個確認訊號，再重新判斷", swing: 3, long: 1 },
      { label: "回到原本的投資理由，不因短線波動立刻改變", long: 3, swing: 1 },
      { label: "會一直盯盤，怕一離開就錯過或來不及", safety: 2 },
    ],
  },
  {
    number: 2,
    section: "操作節奏",
    prompt: "你能穩定投入市場觀察的時間，比較接近哪一種？",
    choices: [
      { label: "交易日能保留固定盤中時段，且不易被打斷", ultra: 3, swing: 1 },
      { label: "每天可安排 20–40 分鐘，收盤後也能複盤", swing: 3, long: 1 },
      { label: "每週固定整理一次，比較適合不被行情追著跑", long: 3 },
      { label: "時間非常零碎，常在忙碌或情緒很滿時才看盤", safety: 2 },
    ],
  },
  {
    number: 3,
    section: "操作節奏",
    prompt: "面對一筆交易，你比較習慣先決定什麼？",
    choices: [
      { label: "觸發條件、進場位置與失效點", ultra: 2, swing: 2 },
      { label: "趨勢是否成立、可承受多久的時間停損", swing: 3, long: 1 },
      { label: "基本邏輯是否仍在，未來幾季是否值得等待", long: 3 },
      { label: "先買了再說，之後看市場怎麼走", safety: 3 },
    ],
  },
  {
    number: 4,
    section: "操作節奏",
    prompt: "你認為『等待』在操作中的角色是？",
    choices: [
      { label: "等待精準的進出場窗口，錯過也不追", ultra: 3, swing: 1 },
      { label: "等待價格與趨勢彼此確認，再放大部位", swing: 3 },
      { label: "等待企業或長期趨勢真正兌現", long: 3 },
      { label: "很難等，沒有動作會讓我覺得不踏實", safety: 2 },
    ],
  },
  {
    number: 5,
    section: "操作節奏",
    prompt: "哪種持有週期，最能讓你保持清楚而不是疲累？",
    choices: [
      { label: "幾天到兩週，快進快出但必須有規則", ultra: 3 },
      { label: "兩週到兩個月，能跟著一段趨勢走", swing: 3 },
      { label: "數月以上，只在核心理由改變時調整", long: 3 },
      { label: "我常常一開始說短線，最後卻不知道該持有多久", safety: 2 },
    ],
  },
  {
    number: 6,
    section: "心理與決策",
    prompt: "當一筆部位跌到你原先設定的停損附近時，你通常會？",
    choices: [
      { label: "執行原計畫；是否再進場，留給下一次新條件", ultra: 2, swing: 2, long: 1 },
      { label: "先檢查趨勢是否失效，再依規則減碼或出場", swing: 3, long: 1 },
      { label: "只要長期理由未變，會接受合理波動", long: 3 },
      { label: "常會把停損往下移，因為不想承認看錯", safety: 4 },
    ],
  },
  {
    number: 7,
    section: "心理與決策",
    prompt: "朋友、社群或新聞都在談同一檔標的時，你最可能怎麼做？",
    choices: [
      { label: "只把它當線索，回到自己的價格、量能與規則", ultra: 2, swing: 2, long: 1 },
      { label: "先觀察一段時間，確認市場結構再決定", swing: 3, long: 1 },
      { label: "若不符合長期篩選條件，再熱門也不處理", long: 3 },
      { label: "會怕錯過，常在別人都在討論時才想進去", safety: 3 },
    ],
  },
  {
    number: 8,
    section: "心理與決策",
    prompt: "連續兩筆交易不如預期時，你最接近哪一種狀態？",
    choices: [
      { label: "暫停新交易，回看是否違反原則後再決定", ultra: 2, swing: 2, long: 1 },
      { label: "降低頻率與部位，等待下一個完整設定", swing: 3 },
      { label: "重新檢視長期假設，不會用更多交易把損失追回來", long: 3 },
      { label: "會想趕快做下一筆，把失去的感覺扳回來", safety: 4 },
    ],
  },
  {
    number: 9,
    section: "心理與決策",
    prompt: "如果持有的標的波動加大，晚上休息前你的狀態通常是？",
    choices: [
      { label: "已設好風險界線，所以能暫時離開螢幕", ultra: 2, swing: 2, long: 1 },
      { label: "會看一次收盤結構，但不需要整晚反覆確認", swing: 3 },
      { label: "只要部位符合長期配置，不會因一天波動失眠", long: 3 },
      { label: "腦中會一直重播，甚至影響睡眠或工作", safety: 3 },
    ],
  },
  {
    number: 10,
    section: "心理與決策",
    prompt: "你過去最常為交易結果找的理由是？",
    helper: "選最誠實、最常出現的一種。",
    choices: [
      { label: "我有沒有照自己的流程做，而不是只看賺賠", ultra: 2, swing: 2, long: 2 },
      { label: "我是不是太早進或太早出，需要修正節奏", swing: 2, ultra: 1 },
      { label: "原本的長期假設是否真的改變", long: 3 },
      { label: "都是市場、消息、別人或運氣害的", safety: 3 },
    ],
  },
  {
    number: 11,
    section: "資源與安全門檻",
    prompt: "你預計用來操作的資金，屬於哪一種？",
    choices: [
      { label: "與生活、緊急預備金完全分開，可承受波動", ultra: 1, swing: 1, long: 1 },
      { label: "是閒置資金的一部分，但仍有清楚比例上限", swing: 1, long: 1 },
      { label: "以長期目標為主，短期沒有動用壓力", long: 2 },
      { label: "近期會用到，或虧損會直接影響生活與關係", safety: 5 },
    ],
  },
  {
    number: 12,
    section: "資源與安全門檻",
    prompt: "對融資、槓桿或借來的資金，你目前的態度是？",
    choices: [
      { label: "不使用；先確保現金與風險界線", ultra: 1, swing: 1, long: 1 },
      { label: "了解風險，但目前沒有把它納入操作", swing: 1, long: 1 },
      { label: "只做長期資產配置，不因短線機會放大槓桿", long: 2 },
      { label: "覺得不用槓桿或借力，很難把機會做大", safety: 5 },
    ],
  },
  {
    number: 13,
    section: "資源與安全門檻",
    prompt: "你現在是否有一份能回看的交易紀錄或固定檢討方式？",
    choices: [
      { label: "有，包含進場理由、失效點與事後檢討", ultra: 2, swing: 2, long: 1 },
      { label: "有基本紀錄，會在週末回看趨勢與部位", swing: 3, long: 1 },
      { label: "有長期投資筆記，會更新持有理由與配置", long: 3 },
      { label: "大多靠記憶或當下感覺，沒有固定留下紀錄", safety: 3 },
    ],
  },
  {
    number: 14,
    section: "資源與安全門檻",
    prompt: "當你察覺自己壓力、睡眠或情緒狀態不穩時，你會？",
    choices: [
      { label: "主動降低頻率或不做新交易，等狀態回穩", ultra: 2, swing: 2, long: 1 },
      { label: "把操作縮小為觀察與複盤，暫不加碼", swing: 3, long: 1 },
      { label: "維持長期配置，不在狀態差時做大幅調整", long: 3 },
      { label: "反而更想靠交易把焦慮或空虛壓下去", safety: 4 },
    ],
  },
  {
    number: 15,
    section: "資源與安全門檻",
    prompt: "現在的你，最希望操作股票替你解決什麼？",
    choices: [
      { label: "在規則內累積經驗，理解市場與自己", ultra: 1, swing: 2, long: 1 },
      { label: "建立一套能長期使用、不靠情緒的決策方法", swing: 3, long: 1 },
      { label: "讓資產有時間參與長期成長，而非天天證明自己", long: 3 },
      { label: "盡快把目前的壓力、焦慮或財務缺口翻過去", safety: 5 },
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
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const lifePath = getLifePath(birthdate);

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
    const gated = score.safety >= 7 || [11, 12, 15].some((number) => {
      const answer = answers[number];
      return answer === 3;
    });

    return { score, best, gated };
  }, [answers]);

  function chooseAnswer(questionNumber: number, choiceIndex: number) {
    setAnswers((current) => ({ ...current, [questionNumber]: choiceIndex }));
  }

  function restart() {
    setStarted(false);
    setBirthdate("");
    setAnswers({});
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <section className="hero-shell">
        <nav className="top-nav" aria-label="主要導覽">
          <div className="brand-mark"><span>NAS</span><small>NUMEROLOGY · AWARENESS · SELF</small></div>
          <div className="nav-note">操作節奏適配掃描 <i>01</i></div>
        </nav>

        {!started ? (
          <div className="hero-content">
            <div className="eyebrow"><span />個人操作適配測驗</div>
            <h1>你不一定缺方法。<br />你可能只是用錯了<span>操作節奏</span>。</h1>
            <p className="hero-copy">用 15 個情境，看見你在波動、等待與壓力下的決策習慣，找出目前更能承接的操作方式。</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setStarted(true)}>開始 6 分鐘掃描 <b>→</b></button>
              <p>不蒐集帳戶資料 · 不推薦標的 · 結果僅供自我覺察與風險管理</p>
            </div>
            <div className="hero-matrix" aria-hidden="true">
              <div className="matrix-line line-a" /><div className="matrix-line line-b" />
              <div className="matrix-dot dot-a" /><div className="matrix-dot dot-b" /><div className="matrix-dot dot-c" />
              <span className="matrix-caption">DECISION<br />UNDER<br />PRESSURE</span>
            </div>
          </div>
        ) : (
          <section className="assessment-layout" aria-label="操作適配問卷">
            <aside className="assessment-sidebar">
              <div className="eyebrow"><span />操作節奏適配掃描</div>
              <h2>先看懂你<br />如何做決定。</h2>
              <p>這不是人格標籤，也不是投資建議。它看的是你現在的操作條件與壓力反應。</p>
              <div className="method-list">
                <div><em>01</em><span>操作節奏<br /><small>時間、等待與持有週期</small></span></div>
                <div><em>02</em><span>心理與決策<br /><small>停損、跟風與壓力反應</small></span></div>
                <div><em>03</em><span>資源與安全<br /><small>資金用途、紀律與生活穩定度</small></span></div>
              </div>
              <div className="sidebar-disclaimer">請以「過去三個月的真實狀態」作答，而不是理想中的自己。</div>
            </aside>

            <div className="question-panel">
              {!showResult ? (
                <>
                  <div className="progress-header">
                    <div><strong>{answeredCount}</strong><span> / {questions.length} 已完成</span></div>
                    <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                  </div>

                  <div className="birth-card">
                    <div><span className="question-index">PROFILE</span><h3>你的生命數字</h3><p>作為傾向解讀的輔助鏡子，不直接決定你的操作結果。</p></div>
                    <label>
                      <span>出生日期</span>
                      <input type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} aria-label="出生日期" />
                    </label>
                    {lifePath && <div className="life-path-badge"><span>生命數字</span><b>{lifePath}</b></div>}
                  </div>

                  <div className="question-stack">
                    {questions.map((question) => (
                      <article className="question-card" key={question.number}>
                        <div className="question-meta"><span>{String(question.number).padStart(2, "0")}</span><small>{question.section}</small></div>
                        <h3>{question.prompt}</h3>
                        {question.helper && <p className="question-helper">{question.helper}</p>}
                        <div className="choice-list">
                          {question.choices.map((choice, index) => {
                            const active = answers[question.number] === index;
                            return <button className={`choice ${active ? "is-active" : ""}`} key={choice.label} onClick={() => chooseAnswer(question.number, index)} aria-pressed={active}>
                              <span>{String.fromCharCode(65 + index)}</span>{choice.label}
                            </button>;
                          })}
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="submit-zone">
                    <div><span>完成後你會得到</span><p>操作節奏建議、風險警訊與一條現在最該先守住的原則。</p></div>
                    <button className="primary-button" disabled={answeredCount !== questions.length || !birthdate} onClick={() => { setShowResult(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>查看我的結果 <b>→</b></button>
                  </div>
                </>
              ) : (
                <section className="result-panel" aria-live="polite">
                  <div className="result-topline"><span>你的掃描結果</span><button onClick={restart}>重新填寫</button></div>
                  <div className="result-hero">
                    <p>目前操作適配</p>
                    <h2>{result.gated ? "先建立規則，再談操作週期" : result.best.label}</h2>
                    <div className="result-rule" />
                    <p className="result-lede">{result.gated
                      ? "你不是不適合市場；現在最需要先處理的，是資金用途、情緒壓力或紀律條件。把風險界線建好，才不會用交易處理生活焦慮。"
                      : result.best.detail}</p>
                  </div>

                  <div className="result-grid">
                    <article><span>你的節奏優勢</span><h3>{result.gated ? "先把『不交易』變成一個有效選項" : result.best.label === "超短線操作" ? "能在規則清楚時快速處理訊號" : result.best.label === "波段操作" ? "能讓確認與耐心一起工作" : "能把短期雜訊留在決策之外"}</h3></article>
                    <article><span>現在的關鍵提醒</span><h3>{result.gated ? "不要用近期會動用的錢、槓桿或情緒壓力，逼自己立刻翻身。" : "再適合的週期，也必須先寫下失效條件與部位上限。"}</h3></article>
                  </div>

                  <section className="operating-card">
                    <div className="operating-card-head"><span>下一步，不是多做；是先守住。</span><i>OPERATING NOTE</i></div>
                    <div className="rule-content">
                      <div><small>你本週的唯一原則</small><p>{result.gated ? "任何需要用交易證明自己、補回壓力或挽回損失的時候，都不開新倉。" : result.best.label === "超短線操作" ? "沒有事先寫好觸發與失效點，就不因盤中波動臨時出手。" : result.best.label === "波段操作" ? "沒有趨勢確認與時間停損，就不把等待誤當成耐心。" : "沒有回到長期理由與配置上限，就不因單日波動大幅調整。"}</p></div>
                      <div><small>生命數字的提醒</small><p>{lifePathNotes[lifePath ?? 1]}</p></div>
                    </div>
                  </section>

                  <section className="result-disclaimer">
                    <strong>閱讀這份結果前，請記得：</strong>這是自我覺察與風險管理工具，不構成個別投資建議、招攬或報酬承諾。超短線與頻繁交易需要足夠的經驗、時間、資源與風險承受能力；若你的資金近期要用、沒有風控紀錄，或交易已影響生活，現金與觀察都是有效選項。
                  </section>
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
