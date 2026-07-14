export type DecisionPattern = "chase" | "external" | "hold" | "observe";
export type OperatingStyle = "learn" | "day" | "swing" | "long";

type Axis = {
  path: string;
  role: string;
  title: string;
  body: string;
  prompt: string;
};

type DossierInput = {
  pattern: DecisionPattern;
  style: OperatingStyle;
  solar: Axis;
  lunar: Axis;
};

const patternDetails: Record<DecisionPattern, { label: string; strength: string; blindSpot: string; reset: string }> = {
  chase: {
    label: "怕錯過型",
    strength: "你對變化與機會的感受很快。別人還在觀望時，你已經能察覺到局勢正在動，這份敏感讓你不容易完全被動。",
    blindSpot: "壓力高時，你容易把『我需要立刻做點什麼』誤認成『現在就是答案』。行動短暫降低焦慮，卻可能讓你跳過最重要的判斷。",
    reset: "任何想立刻出手的時刻，先寫下三句話：我看見的事實是什麼？我最怕失去什麼？如果今天不動，最糟會怎樣？",
  },
  external: {
    label: "借用答案型",
    strength: "你願意聽、願意參考，也知道單靠自己不一定看得完整。這份開放能讓你看見不同角度，而不是困在單一想法裡。",
    blindSpot: "當對方說得很肯定，或群體氣氛很強時，你可能把別人的把握當成自己的理解。最後即使做了選擇，心裡仍沒有真正承擔它。",
    reset: "先把外界資訊分成『事實、觀點、情緒』三欄。看完任何人的意見，都回到一句：若沒有人替我背書，我目前願意為哪一個判斷負責？",
  },
  hold: {
    label: "撐住型",
    strength: "你重視承諾，也有不因一點雜訊就改變方向的能力。當別人被短期波動帶走時，你能守住原先看見的價值。",
    blindSpot: "一旦投入很多，你可能把調整解讀成否定自己，於是用更多忍耐證明原本沒有錯。真正需要更新的條件，反而被『我不能放棄』蓋住。",
    reset: "把『當初為什麼開始』與『現在還剩下什麼理由』分開寫。調整不是否定過去，而是承認眼前的資訊已經不同。",
  },
  observe: {
    label: "觀察型",
    strength: "你有能力在訊號很亂時先停一下，分辨事實、情緒與外界節奏。這讓你比較不會把一時的反應直接變成長期決定。",
    blindSpot: "若過度想把每件事都看懂，觀察可能變成延後。你不是缺資訊，而是需要替自己設定『資訊夠用，就開始驗證』的界線。",
    reset: "替每個重要決定設一個觀察期限與最小行動。停下來是能力；在期限內做一個可承受的小驗證，才不會讓暫停變成逃避。",
  },
};

const styleDetails: Record<OperatingStyle, { label: string; insight: string; boundary: string; practice: string }> = {
  learn: {
    label: "先多充實股票知識，再談交易",
    insight: "這不是能力不足的判定，而是你目前的時間、資金或買賣理由，還不足以承接任何一種操作節奏。先把判斷工具補起來，才不會讓情緒替你選操作方式。",
    boundary: "在還說不清買進理由、離開條件與可承受損失前，不用急著證明自己適合當沖、波段或長期。先用觀察、記錄與小額模擬建立語言。",
    practice: "接下來七天，只做一件事：每天挑一則讓你想買或想賣的訊息，分別寫下它是事實、別人的觀點，還是你自己的感受。",
  },
  day: {
    label: "目前條件較接近當沖",
    insight: "你有較多盤中時間，也傾向在短時間裡確認判斷。這是一種條件對照，不等於你應該立刻操作；短線最需要的，是規則先於情緒。",
    boundary: "沒有在盤前寫下進出條件，就不因盤中漲跌臨時做決定。可承受的小筆資金，是用來學習規則，不是用來追回情緒。",
    practice: "接下來七天，若你看盤，只記錄三個節點：進場前你知道什麼、當下你感覺什麼、離開後你如何解釋。先不急著增加動作。",
  },
  swing: {
    label: "目前條件較接近波段操作",
    insight: "你能保留觀察時間，也願意讓一段趨勢慢慢成形。這份耐心是優勢；真正的考驗不在每天有沒有動作，而在等待時能否區分確認與硬撐。",
    boundary: "沒有新的理由支持方向，就不把『再等一下』當成唯一策略。波段的耐心，需要和明確的檢視點一起存在。",
    practice: "接下來七天，替每個想持有的選擇寫一個檢視日期：到那一天，我要看哪三個條件，才能決定續抱、調整或離開？",
  },
  long: {
    label: "目前條件較接近長期持有",
    insight: "你的時間、資金與等待能力，比較能承接長一點的選擇。長期不是買了不管，而是用較少的短期雜訊，回到資產目標、配置與持有理由。",
    boundary: "沒有回到長期理由與可用資金，就不因一日漲跌大幅改變。能承受時間，不代表要承受沒有邊界的風險。",
    practice: "接下來七天，寫下你想長期持有時真正相信的三個理由，並補上一句：出現什麼變化時，我願意重新檢查這個相信？",
  },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function section(title: string, body: string) {
  return `【${title}】\n${body}`;
}

export function buildDecisionDossier(input: DossierInput) {
  const pattern = patternDetails[input.pattern];
  const style = styleDetails[input.style];
  const solar = input.solar;
  const lunar = input.lunar;
  const sections = [
    section("這不是一份投資答案，而是一張你的決策底圖", `你這次最常出現的決策慣性是「${pattern.label}」，而目前條件較接近「${style.label}」。這兩個結果要一起看：前者描述你在不確定裡容易怎麼反應，後者看的是你的時間、資金、等待方式與準備度。它們不是人格標籤，更不替你決定該買什麼；它們讓你看見，當市場、關係或工作突然出現壓力時，哪一個內在反應最容易先接管。能看見慣性，不是為了責怪自己，而是為了在下一次反應發生前，多留一點選擇的空間。`),
    section("你的決策慣性：先看見力量，再看見慣性", `${pattern.strength}\n\n${pattern.blindSpot}\n\n這個模式不只會出現在股票。當你面對工作機會、關係裡的拉扯、金錢壓力或家人期待時，同一個反應常會換一個情境再出現。你要觀察的不是『我是不是又做錯了』，而是：我一感到不確定，最先想保護的是安全、認同、投入，還是掌控感？當這個問題被說清楚，你就不必每一次都從情緒最滿的地方開始做決定。`),
    section("你目前的操作節奏：條件比衝動更重要", `${style.insight}\n\n${style.boundary}\n\n股票是一個很誠實的情境，因為它會把人的等待、急迫、比較、控制與害怕放大。但這份結果不提供標的、不預測報酬，也不是個別投資建議。真正有價值的部分是：在你想做任何交易前，先確認這個決定符合你的時間、資金與規則，而不是只符合當下的感覺。能承接的節奏，永遠比看起來厲害的節奏重要。`),
    section("生命數字是初始設定，不是命定結論", `這份報告把生命數字放在決策裡，不是要用數字替你下結論。它比較像一套初始設定的語言：你天生較容易先注意什麼、先保護什麼、又在哪裡容易忽略自己的界線。這些初始設定會影響你接收訊號、理解他人、感受壓力與採取行動的順序，因此也會影響決策；但它不決定市場結果，也不比你的覺察、知識與練習更有力量。數字的用途，是讓你在反應啟動時更快認出自己，而不是把人生交給一個分類。`),
    section(`陽曆 ${solar.path}：${solar.role}`, `${solar.title}。${solar.body}\n\n放回這次的測驗看，陽曆這一軸提醒你：當外在環境很吵、別人的意見很強，或你很想趕快證明自己時，你慣常的思考與表現會先替你做什麼？它影響你怎麼讀懂機會、怎麼說服自己、怎麼在人前表現篤定。${solar.prompt}`),
    section(`陰曆 ${lunar.path}：${lunar.role}`, `${lunar.title}。${lunar.body}\n\n陰曆這一軸更靠近你在真正要行動時的情緒反應。外在你可能說得很清楚，內在卻仍在緊張、急著確認、怕失去，或不願放手。當你把這個層次也放進來，就能分辨：此刻的動作，是成熟的選擇，還是情緒想立刻得到安撫？${lunar.prompt}`),
    section("兩條軸線放在一起：你怎麼從想法走到行動", `陽曆顯示的是你比較習慣用什麼方式理解世界、表現自己；陰曆則照見你在需要承擔時，情緒與行動會怎麼接手。這兩條線有時一致，有時互相拉扯。當它們一致時，你會感覺很有方向；當它們拉扯時，你可能表面很篤定，內在卻一直不安，或心裡早有感覺，行動卻遲遲沒有開始。這不是矛盾，而是提醒你：重要決定要同時問過外在的理由與內在的承受。只用其中一邊，容易把自己推得太快，或留得太久。`),
    section("下一次卡住時，用三層把自己帶回來", `第一層，先回到事實：現在真正發生了什麼？哪些是價格、訊息、對方說過的話或已經能驗證的條件？第二層，再承認感受：我現在是急、怕、想證明、捨不得，還是想有人替我確定？感受不需要被否定，但它不能假裝成事實。第三層，才問行動：在我能承受的範圍裡，下一步是觀察、補資料、找人討論、做小驗證，還是暫時不動？\n\n這三層看似簡單，卻能把決策從自動反應拉回有意識的選擇。尤其當你發現自己反覆陷在同一種結果，不必急著換一個更厲害的方法；先看是在哪一層混在一起了。把事實當感受，你會過度防衛；把感受當事實，你會衝動行動；把行動當成唯一出口，你會忘記其實也可以先停。每一次分開來看，都是把決定權慢慢拿回自己手上。`),
    section("怎麼使用這份報告，才不會又變成另一個標籤", `第一次讀完時，先圈出讓你最有感的一句，不必急著把所有提醒都做到。第二次在真正面對一個重要決定時，再回來看：我此刻比較像哪一個慣性？陽曆的外在習慣正在怎麼說服我？陰曆的情緒又想把我帶往哪裡？最後才選一個最小、最可執行的動作。\n\n這份報告不是一次看完就結束的答案，而是一面可以重複使用的鏡子。你不需要因為看見慣性就把自己修正得完美；只要每一次比上一次早一點認出它，選擇就已經開始不同。真正的改變，不是從強迫自己不再有情緒開始，而是從你願意在情緒裡仍然回到自己開始。`),
    section("接下來七天，請做一個小實驗", `${style.practice}\n\n再加上一個屬於你的暫停句：${pattern.reset}\n\n每次重要決定前，不必一次把自己變成完全不同的人。只要先多留三十秒，把事實、感受與下一步分開。你會慢慢發現：不是情緒不能出現，而是情緒出現後，你仍然可以選擇不立刻把方向交出去。`),
    section("最後想留給你", `這份「決策底圖」不是要你從此不犯錯。成熟的決策不是永遠選對，而是即使結果還不知道，你也越來越能說清楚：我為什麼這樣選、我願意承擔什麼、出現什麼訊號時我會重新看。股票只是這段練習的入口。當你開始看見自己如何怕錯過、借用答案、撐住或停下來觀察，這份理解也會回到金錢、關係、工作與你真正想過的人生裡。`),
  ];

  const text = sections.join("\n\n");
  const htmlSections = sections
    .map((item) => {
      const [heading, ...paragraphs] = item.split("\n");
      return `<tr><td style="padding:0 0 26px;"><h2 style="margin:0 0 12px;color:#17201e;font-size:20px;line-height:1.45;font-weight:400;letter-spacing:-.35px;">${escapeHtml(heading.replace(/[【】]/g, ""))}</h2>${paragraphs.map((paragraph) => `<p style="margin:0 0 12px;color:#52615b;font-size:15px;line-height:1.9;">${escapeHtml(paragraph)}</p>`).join("")}</td></tr>`;
    })
    .join("");
  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>你的決策底圖｜NAS</title></head><body style="margin:0;background:#eef2ee;font-family:-apple-system,BlinkMacSystemFont,'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif;color:#17201e;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2ee;"><tr><td style="padding:28px 14px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:auto;background:#ffffff;"><tr><td style="padding:34px 34px 30px;background:#17201e;color:#ffffff;"><p style="margin:0 0 22px;color:#a8c3b6;font-size:11px;letter-spacing:1.8px;">NAS · NOAGE SPACE</p><p style="margin:0 0 9px;color:#d7644e;font-size:12px;letter-spacing:1.4px;">你的免費深度解讀</p><h1 style="margin:0;color:#ffffff;font-size:34px;line-height:1.22;font-weight:400;letter-spacing:-1px;">你的決策底圖</h1><p style="margin:14px 0 0;color:#d6e0da;font-size:15px;line-height:1.7;">把當下慣性、操作條件與生命數字的初始設定，放回同一張圖裡看。</p></td></tr><tr><td style="padding:30px 34px 8px;"><p style="margin:0 0 8px;color:#4f7567;font-size:11px;letter-spacing:1.4px;">本次結果</p><p style="margin:0;color:#17201e;font-size:20px;line-height:1.55;">${escapeHtml(pattern.label)} · ${escapeHtml(style.label)}</p></td></tr><tr><td style="padding:20px 34px 18px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #dce4df;">${htmlSections}</table></td></tr><tr><td style="padding:26px 34px;background:#e5ede7;"><p style="margin:0 0 8px;color:#4f7567;font-size:11px;letter-spacing:1.4px;">NAS 提醒</p><p style="margin:0;color:#52615b;font-size:13px;line-height:1.75;">數字是理解自己的工具，不是限制你的答案。這份內容不構成投資建議、不推薦標的，也不保證任何結果。</p></td></tr></table></td></tr></table></body></html>`;

  return { title: "你的決策底圖｜NAS 免費深度解讀", text, html, characterCount: text.replace(/\s/g, "").length };
}
