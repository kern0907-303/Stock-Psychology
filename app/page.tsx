"use client";

import { useMemo, useState } from "react";

type Pattern = "chase" | "external" | "hold" | "observe";
type Choice = { label: string; pattern: Pattern };
type Question = { number: number; prompt: string; choices: Choice[] };

const questions: Question[] = [
  { number: 1, prompt: "你看到一檔股票連續上漲，身邊的人都在討論。你第一個反應通常是？", choices: [
    { label: "怕再等就沒有機會，會想先做點什麼。", pattern: "chase" }, { label: "先問問懂的人怎麼看，再決定要不要跟。", pattern: "external" }, { label: "如果已經看好，就傾向相信自己的原本判斷。", pattern: "hold" }, { label: "先停一下：我是真的懂，還是只是怕錯過？", pattern: "observe" },
  ] },
  { number: 2, prompt: "買進後沒有照預期上漲，反而開始下跌。你比較像哪一種？", choices: [
    { label: "很想趕快做別的選擇，把不舒服的感覺扳回來。", pattern: "chase" }, { label: "會立刻去看別人怎麼說，希望找到一個答案。", pattern: "external" }, { label: "既然已經選了，就先撐住，不想太快承認可能看錯。", pattern: "hold" }, { label: "先分開看：價格的變化，和我心裡的害怕是不是同一件事。", pattern: "observe" },
  ] },
  { number: 3, prompt: "有人很有把握地對你說：『這次真的不能錯過。』你會？", choices: [
    { label: "被那份篤定帶動，容易想立刻加入。", pattern: "chase" }, { label: "他比我懂，我多半會把他的判斷當成主要依據。", pattern: "external" }, { label: "就算大家都說好，我還是比較相信自己原本的看法。", pattern: "hold" }, { label: "會想知道：他憑什麼這樣判斷？我又知道多少？", pattern: "observe" },
  ] },
  { number: 4, prompt: "當一筆決定剛好做對、得到明顯回報時，最接近你的是？", choices: [
    { label: "會覺得現在的感覺對了，想趁勢再多做一些。", pattern: "chase" }, { label: "會很在意別人有沒有認同我這次選得好。", pattern: "external" }, { label: "會更確信原本的選擇，不太想聽不同看法。", pattern: "hold" }, { label: "會回頭想：這次是判斷、運氣，還是剛好遇到對的時機？", pattern: "observe" },
  ] },
  { number: 5, prompt: "你會開始買股票，最接近哪一個原因？", choices: [
    { label: "不想看別人都在前進，自己卻什麼都沒做。", pattern: "chase" }, { label: "身邊有人帶著做，感覺比較不會錯。", pattern: "external" }, { label: "我早就有自己的想法，只是想證明它做不做得到。", pattern: "hold" }, { label: "想用這個情境，看看自己遇到不確定時到底怎麼反應。", pattern: "observe" },
  ] },
  { number: 6, prompt: "這種反應只會出現在股票嗎？面對工作、關係或重要選擇時，你通常會？", choices: [
    { label: "事情一有變化就很想立刻回應，否則會不安心。", pattern: "chase" }, { label: "很需要有人告訴我怎麼選，才比較敢往前。", pattern: "external" }, { label: "一旦投入就不太想改，寧可自己慢慢扛。", pattern: "hold" }, { label: "先讓情緒過去一點，再決定自己真正要的是什麼。", pattern: "observe" },
  ] },
  { number: 7, prompt: "當你覺得自己落後別人時，最容易出現哪一個念頭？", choices: [
    { label: "我得快一點，不能再等。", pattern: "chase" }, { label: "是不是我沒有跟上別人的方法？", pattern: "external" }, { label: "我不想輸，所以更想證明自己的路是對的。", pattern: "hold" }, { label: "我會提醒自己：別人的進度不等於我的方向。", pattern: "observe" },
  ] },
  { number: 8, prompt: "如果一個選擇已經投入不少時間、金錢或心力，後來發現不太對，你通常會？", choices: [
    { label: "想趕快找下一個更好的選項，讓自己不要白費。", pattern: "chase" }, { label: "問很多人的意見，希望有人替我做最後決定。", pattern: "external" }, { label: "很難放下，因為承認要調整會覺得前面都白做了。", pattern: "hold" }, { label: "重新看眼前的條件，不用過去的投入替現在做決定。", pattern: "observe" },
  ] },
  { number: 9, prompt: "你壓力很大、情緒很滿的那幾天，做決定時通常是？", choices: [
    { label: "更想趕快做出改變，至少感覺自己沒有停住。", pattern: "chase" }, { label: "更容易被別人的一句話影響方向。", pattern: "external" }, { label: "更不想動原本的安排，因為改變太麻煩。", pattern: "hold" }, { label: "知道自己狀態不適合下判斷，會先把決定放一放。", pattern: "observe" },
  ] },
  { number: 10, prompt: "對你來說，一個『好決定』最重要的是什麼？", choices: [
    { label: "不要錯過真正的機會。", pattern: "chase" }, { label: "有人可以一起確認，我不是一個人猜。", pattern: "external" }, { label: "選了就能撐住，不輕易被外界改變。", pattern: "hold" }, { label: "即使結果未知，我仍知道自己為什麼這樣選。", pattern: "observe" },
  ] },
];

const results: Record<Pattern, { label: string; title: string; lede: string; strength: string; reminder: string }> = {
  chase: { label: "怕錯過型", title: "你對「機會正在離開」很敏感。", lede: "你不一定貪心，而是很難忍受自己慢了一步。當不確定感升高，行動會先替你帶來一點安心。", strength: "你有反應快、願意嘗試的一面。", reminder: "下一次想立刻做什麼時，先問：我是在看見機會，還是在逃離不安？" },
  external: { label: "借用答案型", title: "你很容易把別人的篤定，當成自己的方向。", lede: "你不是沒有想法；只是當局面模糊時，別人的經驗、語氣與把握，常比你自己的感受更有份量。", strength: "你願意學習，也知道獨自判斷並不容易。", reminder: "下一次想問人之前，先寫下：如果沒有任何人能回答，我目前真正知道的是什麼？" },
  hold: { label: "撐住型", title: "一旦投入，你很想把選擇撐成對的。", lede: "你重視承諾，也不想輕易被外界動搖。但有時候，真正累的不是選錯，而是一直把調整當成否定自己。", strength: "你有耐性、責任感，也能承受別人很快放棄的過程。", reminder: "調整不是推翻過去；它只是讓現在的你，重新對眼前負責。" },
  observe: { label: "觀察型", title: "你有能力把「感受」和「決定」先分開。", lede: "你比較能在不確定裡停一下，確認自己知道什麼、害怕什麼，再決定要不要行動。這不是慢，而是清楚。", strength: "你具備把情緒整理成判斷的空間。", reminder: "暫停是你的能力；記得也替自己設一個回來決定的時間。" },
};

const lifePathNotes: Record<number, string> = { 1: "你傾向自己掌握方向；果斷之前，也讓自己多一點確認的空間。", 2: "把別人的期待，和自己的選擇分開。", 3: "讓興奮成為線索，而不是答案。", 4: "規則能保護你，也別讓它困住新的理解。", 5: "探索很好，但每次轉向都值得知道自己為什麼。", 6: "你不需要靠每一個選擇證明自己夠好。", 7: "資訊夠用後，也允許自己往前一步。", 8: "把勝負放回過程，而不是單一結果。", 9: "遠見也需要照顧眼前真實的需要。", 11: "先安定，再相信你的直覺。", 22: "不用一次把所有責任都放在自己身上。" };

function getLifePath(value: string) { const digits = value.replace(/\D/g, "").split("").map(Number); if (!digits.length) return null; let sum = digits.reduce((total, digit) => total + digit, 0); while (sum > 9 && sum !== 11 && sum !== 22) sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0); return sum; }

export default function Home() {
  const [started, setStarted] = useState(false); const [activeQuestion, setActiveQuestion] = useState(0); const [answers, setAnswers] = useState<Record<number, Pattern>>({}); const [transitioning, setTransitioning] = useState(false); const [showResult, setShowResult] = useState(false); const [birthdate, setBirthdate] = useState("");
  const question = questions[activeQuestion]; const lifePath = getLifePath(birthdate);
  const result = useMemo(() => { const score: Record<Pattern, number> = { chase: 0, external: 0, hold: 0, observe: 0 }; Object.values(answers).forEach((pattern) => { score[pattern] += 1; }); const key = (Object.keys(score) as Pattern[]).sort((a, b) => score[b] - score[a])[0] ?? "observe"; return results[key]; }, [answers]);
  function chooseAnswer(pattern: Pattern) { if (transitioning) return; setAnswers((current) => ({ ...current, [question.number]: pattern })); setTransitioning(true); window.setTimeout(() => { if (activeQuestion === questions.length - 1) { setShowResult(true); window.scrollTo({ top: 0, behavior: "smooth" }); } else setActiveQuestion((current) => current + 1); setTransitioning(false); }, 220); }
  function restart() { setStarted(false); setActiveQuestion(0); setAnswers({}); setShowResult(false); setBirthdate(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  return <main><section className="hero-shell"><nav className="top-nav" aria-label="主要導覽"><div className="brand-mark"><span>NAS</span><small>NOAGE SPACE</small></div><div className="nav-note">一個關於選擇的小測驗 <i>01</i></div></nav>{!started ? <div className="hero-content"><div className="eyebrow"><span />從股票裡看見的事</div><h1>我們以為在看市場，<br />其實常在回應<span>自己。</span></h1><p className="hero-copy">這幾個月進出股票，我慢慢發現：讓人急著買、捨不得賣、一直問別人、或硬撐下去的，往往不只是行情。</p><p className="hero-copy hero-copy-muted">這不是投資測驗。用 10 個情境，看看你遇到不確定時，最常把方向交給誰。</p><div className="hero-actions"><button className="primary-button" onClick={() => setStarted(true)}>開始看看自己 <b>→</b></button><p>約 3 分鐘 · 不問生日 · 不給投資建議</p></div><div className="hero-matrix" aria-hidden="true"><span>WHEN<br />THE ANSWER<br />IS UNCLEAR</span><i /><b /><em /></div></div> : !showResult ? <section className="assessment-layout" aria-label="決策慣性自我覺察"><aside className="assessment-sidebar"><div className="eyebrow"><span />NAS 自我覺察</div><h2>不是要你<br />選對答案。</h2><p>請選擇最近三個月，最真實、最常出現的反應。</p><div className="sidebar-quote">「有時候，我們不是在做選擇，而是在替當下的不安找出口。」</div><div className="sidebar-disclaimer">股票只是情境。這份結果談的是你的決策慣性，不是你的投資能力。</div></aside><div className="question-panel"><section className="single-question" key={question.number} aria-live="polite"><div className="progress-header"><div><strong>{String(activeQuestion + 1).padStart(2, "0")}</strong><span> / {questions.length} 題</span></div><div className="progress-track"><span style={{ width: `${Math.round((activeQuestion / questions.length) * 100)}%` }} /></div></div><div className="question-card"><div className="question-meta"><span>情境 {String(question.number).padStart(2, "0")}</span><small>選最像你的反應</small></div><h3>{question.prompt}</h3><div className="choice-list">{question.choices.map((choice, index) => <button className={`choice ${answers[question.number] === choice.pattern ? "is-active" : ""}`} key={choice.label} onClick={() => chooseAnswer(choice.pattern)} disabled={transitioning}><span>{String.fromCharCode(65 + index)}</span>{choice.label}</button>)}</div></div>{activeQuestion > 0 && <button className="back-button" onClick={() => setActiveQuestion((current) => current - 1)}>← 回到上一題</button>}<p className="auto-note">選定後會自動前往下一題。</p></section></div></section> : <section className="result-layout"><div className="result-panel" aria-live="polite"><div className="result-topline"><span>你的自我覺察結果</span><button onClick={restart}>重新填寫</button></div><div className="result-hero"><p>你最常出現的決策慣性</p><h2>{result.label}</h2><div className="result-rule" /><h3>{result.title}</h3><p className="result-lede">{result.lede}</p></div><div className="result-grid"><article><span>你不是沒有優勢</span><h3>{result.strength}</h3></article><article><span>留給自己的提醒</span><h3>{result.reminder}</h3></article></div><section className="reflection-card"><span>先不用急著改</span><h3>下一次要做重要決定時，先留意：我現在最想避免的是什麼？最想證明的又是什麼？</h3><p>看見這一刻，通常比立刻做出另一個選擇更重要。</p></section><section className="life-invite"><div><span>選擇性延伸</span><h3>想多看一層，你的生命數字會怎麼提醒這個慣性？</h3><p>生日只在這個頁面用來換算，不影響結果，也不會替你決定任何選擇。</p></div><label><span>出生日期（選填）</span><input type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} /></label>{lifePath && <div className="life-note"><b>生命數字 {lifePath}</b><p>{lifePathNotes[lifePath]}</p></div>}</section><section className="nas-follow"><span>NAS 持續分享</span><h3>如果這份結果讓你想到自己，繼續和 NAS 一起練習看懂自己。</h3><p>我們不急著替你定義答案；先看見那些在不確定裡，反覆替你做決定的慣性。</p></section><section className="result-disclaimer"><strong>這份測驗是什麼：</strong>一個從真實情境出發的自我覺察工具。它不是股票建議、不評估投資能力，也不以生命數字預測結果。</section></div></section>}</section><footer><span>NAS · 認識自己，理解自己的選擇。</span><span>數字是理解自己的工具，不是限制你的答案。</span></footer></main>;
}
