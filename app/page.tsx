"use client";

import { FormEvent, useMemo, useState } from "react";
import { buildDecisionDossier } from "../lib/decision-dossier";

type Pattern = "chase" | "external" | "hold" | "observe";
type Style = "learn" | "day" | "swing" | "long";
type Choice<T> = { label: string; value: T };
type Question<T> = { number: number; prompt: string; choices: Choice<T>[] };

const selfQuestions: Question<Pattern>[] = [
  {
    number: 1,
    prompt: "你看到一檔股票連續上漲，身邊的人都在討論。你第一個反應通常是？",
    choices: [
      { label: "怕再等就沒有機會，會想先做點什麼。", value: "chase" },
      { label: "先問問懂的人怎麼看，再決定要不要跟。", value: "external" },
      { label: "如果已經看好，就傾向相信自己的原本判斷。", value: "hold" },
      { label: "先停一下：我是真的懂，還是只是怕錯過？", value: "observe" },
    ],
  },
  {
    number: 2,
    prompt: "買進後沒有照預期上漲，反而開始下跌。你比較像哪一種？",
    choices: [
      { label: "很想趕快做別的選擇，把不舒服的感覺扳回來。", value: "chase" },
      { label: "會立刻去看別人怎麼說，希望找到一個答案。", value: "external" },
      {
        label: "既然已經選了，就先撐住，不想太快承認可能看錯。",
        value: "hold",
      },
      {
        label: "先分開看：價格的變化，和我心裡的害怕是不是同一件事。",
        value: "observe",
      },
    ],
  },
  {
    number: 3,
    prompt: "有人很有把握地對你說：『這次真的不能錯過。』你會？",
    choices: [
      { label: "被那份篤定帶動，容易想立刻加入。", value: "chase" },
      {
        label: "他比我懂，我多半會把他的判斷當成主要依據。",
        value: "external",
      },
      {
        label: "就算大家都說好，我還是比較相信自己原本的看法。",
        value: "hold",
      },
      { label: "會想知道：他憑什麼這樣判斷？我又知道多少？", value: "observe" },
    ],
  },
  {
    number: 4,
    prompt: "當一筆決定剛好做對、得到明顯回報時，最接近你的是？",
    choices: [
      { label: "會覺得現在的感覺對了，想趁勢再多做一些。", value: "chase" },
      { label: "會很在意別人有沒有認同我這次選得好。", value: "external" },
      { label: "會更確信原本的選擇，不太想聽不同看法。", value: "hold" },
      {
        label: "會回頭想：這次是判斷、運氣，還是剛好遇到對的時機？",
        value: "observe",
      },
    ],
  },
  {
    number: 5,
    prompt: "你會開始買股票，最接近哪一個原因？",
    choices: [
      { label: "不想看別人都在前進，自己卻什麼都沒做。", value: "chase" },
      { label: "身邊有人帶著做，感覺比較不會錯。", value: "external" },
      { label: "我早就有自己的想法，只是想證明它做不做得到。", value: "hold" },
      {
        label: "想用這個情境，看看自己遇到不確定時到底怎麼反應。",
        value: "observe",
      },
    ],
  },
  {
    number: 6,
    prompt: "這種反應只會出現在股票嗎？面對工作、關係或重要選擇時，你通常會？",
    choices: [
      { label: "事情一有變化就很想立刻回應，否則會不安心。", value: "chase" },
      { label: "很需要有人告訴我怎麼選，才比較敢往前。", value: "external" },
      { label: "一旦投入就不太想改，寧可自己慢慢扛。", value: "hold" },
      {
        label: "先讓情緒過去一點，再決定自己真正要的是什麼。",
        value: "observe",
      },
    ],
  },
  {
    number: 7,
    prompt: "當你覺得自己落後別人時，最容易出現哪一個念頭？",
    choices: [
      { label: "我得快一點，不能再等。", value: "chase" },
      { label: "是不是我沒有跟上別人的方法？", value: "external" },
      { label: "我不想輸，所以更想證明自己的路是對的。", value: "hold" },
      { label: "我會提醒自己：別人的進度不等於我的方向。", value: "observe" },
    ],
  },
  {
    number: 8,
    prompt:
      "如果一個選擇已經投入不少時間、金錢或心力，後來發現不太對，你通常會？",
    choices: [
      { label: "想趕快找下一個更好的選項，讓自己不要白費。", value: "chase" },
      { label: "問很多人的意見，希望有人替我做最後決定。", value: "external" },
      { label: "很難放下，因為承認要調整會覺得前面都白做了。", value: "hold" },
      {
        label: "重新看眼前的條件，不用過去的投入替現在做決定。",
        value: "observe",
      },
    ],
  },
  {
    number: 9,
    prompt: "你壓力很大、情緒很滿的那幾天，做決定時通常是？",
    choices: [
      { label: "更想趕快做出改變，至少感覺自己沒有停住。", value: "chase" },
      { label: "更容易被別人的一句話影響方向。", value: "external" },
      { label: "更不想動原本的安排，因為改變太麻煩。", value: "hold" },
      {
        label: "知道自己狀態不適合下判斷，會先把決定放一放。",
        value: "observe",
      },
    ],
  },
  {
    number: 10,
    prompt: "對你來說，一個『好決定』最重要的是什麼？",
    choices: [
      { label: "不要錯過真正的機會。", value: "chase" },
      { label: "有人可以一起確認，我不是一個人猜。", value: "external" },
      { label: "選了就能撐住，不輕易被外界改變。", value: "hold" },
      { label: "即使結果未知，我仍知道自己為什麼這樣選。", value: "observe" },
    ],
  },
];

const styleQuestions: Question<Style>[] = [
  {
    number: 11,
    prompt: "你現在能留給股票的時間，比較接近哪一種？",
    choices: [
      { label: "交易日能固定留一段盤中時間，不太會被打斷。", value: "day" },
      { label: "每天收盤後能看一下，也願意每週做一次整理。", value: "swing" },
      {
        label: "每週或每月固定檢視就好，不想被每天的漲跌追著跑。",
        value: "long",
      },
      { label: "時間很零碎，常是看到消息或心情來了才打開。", value: "learn" },
    ],
  },
  {
    number: 12,
    prompt: "如果你真的要買一檔股票，目前最像哪一種準備？",
    choices: [
      { label: "我願意事先寫下今天什麼情況買、什麼情況離開。", value: "day" },
      {
        label: "我會先看它是不是走出一段比較穩的方向，再慢慢跟。",
        value: "swing",
      },
      {
        label: "我更在意幾年後它值不值得持有，不想為幾天波動改變。",
        value: "long",
      },
      { label: "我還說不清自己為什麼買、什麼時候該賣。", value: "learn" },
    ],
  },
  {
    number: 13,
    prompt: "你比較能承受哪一種等待？",
    choices: [
      { label: "幾天內就要知道這次判斷有沒有走對。", value: "day" },
      { label: "願意等幾週到一兩個月，讓一段走勢慢慢成形。", value: "swing" },
      {
        label: "能接受幾個月以上的波動，只看長期理由有沒有改變。",
        value: "long",
      },
      { label: "只要一有波動就很難判斷自己到底該等還是該動。", value: "learn" },
    ],
  },
  {
    number: 14,
    prompt: "你現在打算投入股票的錢，最接近哪一種狀況？",
    choices: [
      { label: "是完全分開的小筆資金，可以承受短期交易的損失。", value: "day" },
      { label: "是可承受波動的閒置資金，能放一段時間。", value: "swing" },
      { label: "近期沒有用途，是為多年後的資產目標準備。", value: "long" },
      { label: "近期可能要用，或虧損會明顯影響我的生活。", value: "learn" },
    ],
  },
];

const patterns: Record<
  Pattern,
  { label: string; lede: string; reminder: string }
> = {
  chase: {
    label: "怕錯過型",
    lede: "你對『機會正在離開』很敏感；不確定感一高，行動會先替你帶來一點安心。",
    reminder: "先問：我是在看見機會，還是在逃離不安？",
  },
  external: {
    label: "借用答案型",
    lede: "局面模糊時，別人的經驗、語氣與把握，常比你自己的感受更有份量。",
    reminder: "先寫下：如果沒有任何人能回答，我目前真正知道的是什麼？",
  },
  hold: {
    label: "撐住型",
    lede: "你重視承諾，也不想輕易被外界動搖；有時卻會把調整誤認成否定自己。",
    reminder: "調整不是推翻過去；是重新對眼前負責。",
  },
  observe: {
    label: "觀察型",
    lede: "你比較能在不確定裡停一下，確認自己知道什麼、害怕什麼，再決定要不要行動。",
    reminder: "暫停是能力；也替自己設一個回來決定的時間。",
  },
};

const styles: Record<
  Style,
  { label: string; title: string; lede: string; principle: string }
> = {
  learn: {
    label: "先多充實股票知識，再談交易",
    title: "現在先不用急著選當沖、波段或長期。",
    lede: "你目前更需要的是把『為什麼買、什麼時候賣、哪些錢不能承受波動』這三件事弄清楚。先有判斷工具，操作週期才不會只是情緒的名字。",
    principle: "先學會說清楚買進理由與離開條件，再用真金白銀驗證。",
  },
  day: {
    label: "目前條件較接近當沖",
    title: "你有較多盤中時間，也傾向快速確認一個判斷。",
    lede: "當沖需要固定時間、明確規則與能承受的小筆風險。這只是你目前條件的對照，不代表你應該立刻開始。",
    principle: "沒有事先寫好進出條件，就不因盤中波動臨時出手。",
  },
  swing: {
    label: "目前條件較接近波段操作",
    title: "你能保留觀察時間，也願意讓一段走勢慢慢發展。",
    lede: "波段操作重點是等待、確認與耐心，不是每天都有動作。這是目前節奏的提示，不是任何標的建議。",
    principle: "沒有看見更清楚的方向，就不把等待誤當成硬撐。",
  },
  long: {
    label: "目前條件較接近長期持有",
    title: "你的時間、資金與耐心，比較能承接長一點的選擇。",
    lede: "長期持有不是買了不管，而是用較少的短期雜訊，回到資產目標與持有理由。這是節奏提示，不是買賣建議。",
    principle: "沒有回到長期理由與資金配置，就不因一天的波動大幅改變。",
  },
};

type LifeProfile = { title: string; body: string; prompt: string };
const lifeProfiles: Record<number, LifeProfile> = {
  1: {
    title: "先想自己走出一條路的人",
    body: "你習慣先有自己的判斷，再決定要不要讓別人加入。外在看起來果斷，壓力大時也容易把『我得自己扛』放得太前面。",
    prompt: "先確認方向，不用急著用一個選擇證明自己夠強。",
  },
  2: {
    title: "很會感受關係與氣氛的人",
    body: "你對他人的反應、關係裡的細節很敏銳，外在常先顧及大家能不能舒服。當訊息太多時，容易忘了自己的感受也需要被放進決定。",
    prompt: "先分清楚：這是我的需要，還是我在替別人安心。",
  },
  3: {
    title: "把感覺與可能性說出來的人",
    body: "你外在容易先從可能性、氣氛與靈感感受到一件事值不值得靠近。當你覺得有意思，表達與行動會很有感染力；壓力下也可能想用下一個新鮮選擇，把不舒服的感覺帶走。",
    prompt: "讓興奮成為你關注的線索，而不是立刻行動的答案。",
  },
  4: {
    title: "需要把事情放回秩序的人",
    body: "你比較安心於看得見的步驟、可重複的安排與明確的底線。這讓你有穩定感；但當環境改變太快，也可能先卡在『還沒準備好』。",
    prompt: "規則是保護，不是要你等到百分之百確定才開始。",
  },
  5: {
    title: "需要空間與新可能的人",
    body: "你對變化和新鮮感反應快，外在容易被新的選項打開視野。當一件事變得悶或受限，你會想轉向；真正的關鍵是知道自己在探索，還是在逃離不舒服。",
    prompt: "每次轉向前，先說清楚你想得到什麼、願意放下什麼。",
  },
  6: {
    title: "很自然會把責任放進心裡的人",
    body: "你容易先看見誰需要被照顧、哪裡還沒做好，也很願意讓事情回到平衡。壓力來時，可能把所有人的期待都當成自己的責任。",
    prompt: "照顧別人之前，先確認你沒有把自己排除在外。",
  },
  7: {
    title: "需要理解透徹才安心的人",
    body: "你外在不一定話多，但內在會一直整理資訊、感受與可能性。這讓你有深度；在不確定時，也可能因為還想再確認一點，而把行動往後放。",
    prompt: "資訊夠用後，替自己設一個可以開始驗證的時間。",
  },
  8: {
    title: "會先看結果與承擔的人",
    body: "你容易從目標、資源與結果去判斷一件事值不值得投入。這份現實感是力量；但當每個選擇都變成輸贏，壓力也會跟著放大。",
    prompt: "把勝負放回過程：這一步是否符合你的條件，比一次贏輸更重要。",
  },
  9: {
    title: "能把事情看得更遠的人",
    body: "你容易看見一件事背後的人、意義與整體影響，也不喜歡只為眼前利益做決定。只是當你看得太遠，有時會忽略現在真正需要被照顧的感受與界線。",
    prompt: "有遠見很好，也記得回來問：眼前的我承受得住嗎？",
  },
  11: {
    title: "感受很快、也很容易被觸動的人",
    body: "你對訊號、氣氛與內在感受的接收很快，常能比別人早一步察覺不對勁或可能性。資訊過多時，敏感會變成過載，需要先讓自己安定。",
    prompt: "先把感受安放好，再決定要不要相信此刻的直覺。",
  },
  22: {
    title: "想把大方向落到現實的人",
    body: "你行動時會希望事情有能承擔的結構，情緒一來也容易把責任先扛起來。你需要的不是再更用力，而是把大方向切成現在能承受的一步。",
    prompt: "先安排界線與資源，再談承擔與長期。",
  },
};
type LifeNumber = { base: number; label: string; steps: number[] };
function getLifeNumber(digits: number[]): LifeNumber | null {
  if (!digits.length) return null;
  const total = digits.reduce((sum, digit) => sum + digit, 0);
  const steps = [total];
  let current = total;
  while (current > 9) {
    current = String(current)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
    steps.push(current);
  }
  const reducedSteps = steps.length === 1 ? [current] : steps.slice(1);
  return {
    base: current,
    steps,
    label: [String(total).padStart(2, "0"), ...reducedSteps].join("/"),
  };
}
function getLifePath(value: string) {
  return getLifeNumber(value.replace(/\D/g, "").split("").map(Number));
}
function getLunarDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("zh-Hant-TW-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "relatedYear")?.value);
  const monthText = parts.find((part) => part.type === "month")?.value ?? "";
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const monthMap: Record<string, number> = {
    正: 1,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    冬: 11,
    臘: 12,
  };
  const cleanMonth = monthText.replace("閏", "");
  const month = monthMap[cleanMonth[0]];
  if (!year || !month || !day) return null;
  return { year, month, day, label: `農曆 ${year} 年${monthText}${day}日` };
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState<"self" | "bridge" | "style">("self");
  const [selfIndex, setSelfIndex] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [selfAnswers, setSelfAnswers] = useState<Record<number, Pattern>>({});
  const [styleAnswers, setStyleAnswers] = useState<Record<number, Style>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [dossierState, setDossierState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [dossierError, setDossierError] = useState("");
  const question =
    stage === "self" ? selfQuestions[selfIndex] : styleQuestions[styleIndex];
  const position = stage === "self" ? selfIndex + 1 : 11 + styleIndex;
  const solarLifeNumber = getLifePath(birthdate);
  const lunarBirth = getLunarDate(birthdate);
  const lunarLifeNumber = lunarBirth
    ? getLifeNumber(
        [lunarBirth.year, lunarBirth.month, lunarBirth.day]
          .join("")
          .split("")
          .map(Number),
      )
    : null;
  const pattern = useMemo(() => {
    const score: Record<Pattern, number> = {
      chase: 0,
      external: 0,
      hold: 0,
      observe: 0,
    };
    Object.values(selfAnswers).forEach((value) => {
      score[value] += 1;
    });
    return (
      (Object.keys(score) as Pattern[]).sort(
        (a, b) => score[b] - score[a],
      )[0] ?? "observe"
    );
  }, [selfAnswers]);
  const style = useMemo(() => {
    const score: Record<Style, number> = {
      learn: 0,
      day: 0,
      swing: 0,
      long: 0,
    };
    Object.values(styleAnswers).forEach((value) => {
      score[value] += 1;
    });
    return score.learn >= 2 || styleAnswers[14] === "learn"
      ? "learn"
      : ((Object.keys(score).filter((key) => key !== "learn") as Style[]).sort(
          (a, b) => score[b] - score[a],
        )[0] ?? "learn");
  }, [styleAnswers]);
  const detailedDossier = useMemo(() => {
    if (!solarLifeNumber || !lunarLifeNumber) return null;
    const solarProfile = lifeProfiles[solarLifeNumber.base];
    const lunarProfile = lifeProfiles[lunarLifeNumber.base];
    if (!solarProfile || !lunarProfile) return null;
    return buildDecisionDossier({
      pattern,
      style,
      solar: {
        path: solarLifeNumber.label,
        role: "想法與外在表現",
        ...solarProfile,
      },
      lunar: {
        path: lunarLifeNumber.label,
        role: "行動與情緒反應",
        ...lunarProfile,
      },
    });
  }, [lunarLifeNumber, pattern, solarLifeNumber, style]);
  function choose(value: Pattern | Style) {
    if (transitioning) return;
    setTransitioning(true);
    if (stage === "self")
      setSelfAnswers((current) => ({
        ...current,
        [question.number]: value as Pattern,
      }));
    else
      setStyleAnswers((current) => ({
        ...current,
        [question.number]: value as Style,
      }));
    window.setTimeout(() => {
      if (stage === "self" && selfIndex === selfQuestions.length - 1) {
        setStage("bridge");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (
        stage === "style" &&
        styleIndex === styleQuestions.length - 1
      ) {
        setShowResult(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (stage === "self") setSelfIndex((current) => current + 1);
      else setStyleIndex((current) => current + 1);
      setTransitioning(false);
    }, 220);
  }
  function restart() {
    setStarted(false);
    setStage("self");
    setSelfIndex(0);
    setStyleIndex(0);
    setSelfAnswers({});
    setStyleAnswers({});
    setShowResult(false);
    setBirthdate("");
    setEmail("");
    setMarketingConsent(false);
    setDossierState("idle");
    setDossierError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function requestDossier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detailedDossier) return;
    setDossierState("sending");
    setDossierError("");
    try {
      const response = await fetch("/api/decision-dossiers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          pattern,
          style,
          solarPath: solarLifeNumber?.label,
          lunarPath: lunarLifeNumber?.label,
          reportTitle: detailedDossier.title,
          reportHtml: detailedDossier.html,
          reportText: detailedDossier.text,
          reportCharacterCount: detailedDossier.characterCount,
          marketingConsent,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "目前無法建立報告申請，請稍後再試。");
      setDossierState("sent");
    } catch (error) {
      setDossierState("error");
      setDossierError(error instanceof Error ? error.message : "目前無法建立報告申請，請稍後再試。");
    }
  }
  return (
    <main>
      <section className="hero-shell">
        <nav className="top-nav" aria-label="主要導覽">
          <div className="brand-mark">
            <span>NAS</span>
            <small>NOAGE SPACE</small>
          </div>
          <div className="nav-note">
            決策慣性 × 股票節奏 <i>01</i>
          </div>
        </nav>
        {!started ? (
          <div className="hero-content">
            <div className="eyebrow">
              <span />
              從股票裡看見的事
            </div>
            <h1>
              我們以為在看市場，
              <br />
              其實常在回應<span>自己。</span>
            </h1>
            <p className="hero-copy">
              這幾個月進出股票，我慢慢發現：讓人急著買、捨不得賣、一直問別人、或硬撐下去的，往往不只是行情。
            </p>
            <p className="hero-copy hero-copy-muted">
              先看你在不確定裡怎麼決定，再看目前較能承接的股票操作節奏。
            </p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => setStarted(true)}
              >
                開始看看自己 <b>→</b>
              </button>
              <p>約 5 分鐘 · 不問生日 · 不推薦標的</p>
            </div>
            <div className="hero-matrix" aria-hidden="true">
              <span>
                DECIDE
                <br />
                THEN
                <br />
                ACT
              </span>
              <i />
              <b />
              <em />
            </div>
          </div>
        ) : !showResult ? (
          stage === "bridge" ? (
            <section className="bridge-layout">
              <div>
                <span>第二段 · 股票操作條件</span>
                <h2>
                  看懂自己之後，
                  <br />
                  也看一下現在的條件。
                </h2>
                <p>
                  以下四題不考你會不會選股，而是看你的時間、資金與等待方式，現在比較能承接哪一種節奏。
                </p>
                <button
                  className="primary-button"
                  onClick={() => setStage("style")}
                >
                  進入第二段 <b>→</b>
                </button>
              </div>
            </section>
          ) : (
            <section
              className="assessment-layout"
              aria-label="決策慣性與股票節奏"
            >
              <aside className="assessment-sidebar">
                <div className="eyebrow">
                  <span />
                  {stage === "self" ? "第一段 · 決策慣性" : "第二段 · 股票條件"}
                </div>
                <h2>
                  {stage === "self" ? (
                    <>
                      不是要你
                      <br />
                      選對答案。
                    </>
                  ) : (
                    <>
                      不是測能力，
                      <br />
                      是看承接。
                    </>
                  )}
                </h2>
                <p>
                  {stage === "self"
                    ? "請選擇最近三個月，最真實、最常出現的反應。"
                    : "請選擇你現在真實能做到的條件，不選理想中的自己。"}
                </p>
                <div className="sidebar-quote">
                  「股票只是情境。你如何面對不確定，才是這份測驗真正想看見的事。」
                </div>
                <div className="sidebar-disclaimer">
                  結果是自我理解與操作節奏提示，不是投資建議或報酬承諾。
                </div>
              </aside>
              <div className="question-panel">
                <section
                  className="single-question"
                  key={question.number}
                  aria-live="polite"
                >
                  <div className="progress-header">
                    <div>
                      <strong>{String(position).padStart(2, "0")}</strong>
                      <span> / 14 題</span>
                    </div>
                    <div className="progress-track">
                      <span
                        style={{
                          width: `${Math.round(((position - 1) / 14) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="question-card">
                    <div className="question-meta">
                      <span>
                        {stage === "self"
                          ? `情境 ${String(question.number).padStart(2, "0")}`
                          : `條件 ${String(question.number - 10).padStart(2, "0")}`}
                      </span>
                      <small>
                        {stage === "self"
                          ? "選最像你的反應"
                          : "選現在最真實的狀況"}
                      </small>
                    </div>
                    <h3>{question.prompt}</h3>
                    <div className="choice-list">
                      {question.choices.map((choice, index) => (
                        <button
                          className="choice"
                          key={choice.label}
                          onClick={() => choose(choice.value)}
                          disabled={transitioning}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(stage === "self" && selfIndex > 0) ||
                  (stage === "style" && styleIndex > 0) ? (
                    <button
                      className="back-button"
                      onClick={() =>
                        stage === "self"
                          ? setSelfIndex((current) => current - 1)
                          : setStyleIndex((current) => current - 1)
                      }
                    >
                      ← 回到上一題
                    </button>
                  ) : null}
                  <p className="auto-note">選定後會自動前往下一題。</p>
                </section>
              </div>
            </section>
          )
        ) : (
          <section className="result-layout">
            <div className="result-panel" aria-live="polite">
              <div className="result-topline">
                <span>你的自我覺察結果</span>
                <button onClick={restart}>重新填寫</button>
              </div>
              <div className="result-hero">
                <p>目前較能承接的操作方向</p>
                <h2>{styles[style].label}</h2>
                <div className="result-rule" />
                <h3>{styles[style].title}</h3>
                <p className="result-lede">{styles[style].lede}</p>
              </div>
              <section className="operating-card">
                <div className="operating-card-head">
                  <span>先守住這一條</span>
                  <i>OPERATING NOTE</i>
                </div>
                <div className="rule-content">
                  <div>
                    <small>現在的操作原則</small>
                    <p>{styles[style].principle}</p>
                  </div>
                  <div>
                    <small>你最常出現的慣性</small>
                    <p>
                      <b>{patterns[pattern].label}</b>：{patterns[pattern].lede}
                    </p>
                  </div>
                </div>
              </section>
              <div className="result-grid">
                <article>
                  <span>留給自己的提醒</span>
                  <h3>{patterns[pattern].reminder}</h3>
                </article>
                <article>
                  <span>請記得</span>
                  <h3>
                    操作週期是目前條件的提示，不是要你證明自己屬於哪一型。
                  </h3>
                </article>
              </div>
              <section className="life-invite">
                <div>
                  <span>選擇性延伸</span>
                  <h3>想多看一層：陽曆與陰曆，會怎麼提醒這個慣性？</h3>
                  <p>
                    陽曆看你慣常的想法與外在表現；陰曆看你在行動與情緒裡較深的反應。輸入陽曆生日後，系統會同步換算農曆；兩者都不影響操作結果，也不替你決定任何選擇。
                  </p>
                </div>
                <label>
                  <span>陽曆出生日期（選填）</span>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(event) => setBirthdate(event.target.value)}
                  />
                </label>
                {solarLifeNumber && lunarBirth && lunarLifeNumber && (
                  <div className="life-note">
                    <div className="life-note-heading">
                      <span>你的雙軸生命數字</span>
                      <p>
                        陽曆 {birthdate.replaceAll("-", "/")} ·{" "}
                        {lunarBirth.label}
                      </p>
                    </div>
                    <p className="life-format-note">
                      顯示方式：原始合計／每一層化簡結果。
                    </p>
                    <div className="life-axis-grid">
                      <article>
                        <span>陽曆生命數字 {solarLifeNumber.label}</span>
                        <small>想法與外在表現</small>
                        <h4>{lifeProfiles[solarLifeNumber.base].title}</h4>
                        <p>{lifeProfiles[solarLifeNumber.base].body}</p>
                        <b>{lifeProfiles[solarLifeNumber.base].prompt}</b>
                      </article>
                      <article>
                        <span>陰曆生命數字 {lunarLifeNumber.label}</span>
                        <small>行動與情緒反應</small>
                        <h4>{lifeProfiles[lunarLifeNumber.base].title}</h4>
                        <p>{lifeProfiles[lunarLifeNumber.base].body}</p>
                        <b>{lifeProfiles[lunarLifeNumber.base].prompt}</b>
                      </article>
                    </div>
                    <div className="life-integration">
                      <span>放回這次的結果看</span>
                      <p>
                        當外在想法和內在行動都被看見，你比較能分辨：此刻是自己的方向、當下的情緒，還是別人的節奏正在替你做決定。
                      </p>
                    </div>
                  </div>
                )}
              </section>
              <section className="dossier-invite" aria-labelledby="dossier-title">
                <div className="dossier-intro">
                  <span>免費深度解讀</span>
                  <h3 id="dossier-title">你的決策底圖</h3>
                  <p>
                    不是一張結果卡，而是一份約 2,500 字的完整解讀。它會把你這次的決策慣性、目前操作條件，以及陽曆／陰曆生命數字放回同一張圖裡，讓你看見自己從想法走到行動時，最常在哪裡被推著走。
                  </p>
                </div>
                {detailedDossier ? (
                  <>
                    <div className="dossier-points">
                      <div>
                        <b>01</b>
                        <span>你的慣性力量與最容易被接管的時刻</span>
                      </div>
                      <div>
                        <b>02</b>
                        <span>目前操作節奏能承接什麼、先守住什麼</span>
                      </div>
                      <div>
                        <b>03</b>
                        <span>陽曆初始設定與陰曆行動情緒的雙軸提醒</span>
                      </div>
                      <div>
                        <b>04</b>
                        <span>一個能在七天內開始的決策小實驗</span>
                      </div>
                    </div>
                    {dossierState === "sent" ? (
                      <div className="dossier-success" role="status">
                        <b>你的決策底圖已寄出。</b>
                        <span>請至 {email} 查看完整 HTML 解讀；若一時沒有看見，也請確認垃圾郵件匣。</span>
                      </div>
                    ) : (
                      <form className="dossier-form" onSubmit={requestDossier}>
                        <label>
                          <span>Email</span>
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                          />
                        </label>
                        <p className="dossier-promise">
                          留下 Email，免費獲得約 {detailedDossier.characterCount.toLocaleString()} 字的「你的決策底圖」詳細分析。
                        </p>
                        <label className="consent-check">
                          <input type="checkbox" required />
                          <span>我同意 NAS 使用此 Email 寄送本次免費報告；原始生日不會被保存。</span>
                        </label>
                        <label className="consent-check consent-check-optional">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(event) => setMarketingConsent(event.target.checked)}
                          />
                          <span>我也願意收到 NAS 不定期的自我理解與決策主題內容。（選填）</span>
                        </label>
                        <button className="primary-button dossier-button" type="submit" disabled={dossierState === "sending"}>
                          {dossierState === "sending" ? "正在建立報告申請" : "免費取得完整解讀"} <b>→</b>
                        </button>
                        {dossierState === "error" ? <p className="dossier-error" role="alert">{dossierError}</p> : null}
                      </form>
                    )}
                  </>
                ) : (
                  <div className="dossier-unlock">
                    請先輸入上方的陽曆生日，完成陽曆與陰曆雙軸換算後，才能生成包含你生命數字的完整解讀。生日只在此頁換算，不會隨 Email 一起保存。
                  </div>
                )}
              </section>
              <section className="nas-follow">
                <span>NAS 持續分享</span>
                <h3>
                  股票是一面鏡子。看懂自己，才比較不會一直把決定交給當下的感覺。
                </h3>
                <p>如果這份結果讓你想到自己，繼續和 NAS 一起練習認識自己。</p>
              </section>
              <section className="result-disclaimer">
                <strong>這份測驗是什麼：</strong>
                一個從真實情境出發的自我覺察工具。它不是個別投資建議、不推薦標的，也不保證任何投資結果。
              </section>
            </div>
          </section>
        )}
      </section>
      <footer>
        <span>NAS · 認識自己，理解自己的選擇。</span>
        <span>數字是理解自己的工具，不是限制你的答案。</span>
      </footer>
    </main>
  );
}
