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

const decisionMapDetails: Record<DecisionPattern, { protection: string }> = {
  chase: { protection: "不錯過眼前的機會" },
  external: { protection: "有人確認、不要只靠自己猜" },
  hold: { protection: "原本的投入與判斷不被推翻" },
  observe: { protection: "資訊夠清楚，自己能夠承擔" },
};

const operatingConditionDetails: Record<OperatingStyle, string> = {
  learn: "先建立買進理由、離開條件與風險的基本語言。",
  day: "盤中時間與事先寫下的規則，要先於當下情緒。",
  swing: "讓等待和檢視點一起存在，不把等待變成硬撐。",
  long: "用長期理由與可用資金，承接短期波動。",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function section(title: string, body: string) {
  return `【${title}】\n${body}`;
}

function buildDecisionMapHtml({
  patternKey,
  styleKey,
  patternLabel,
  styleLabel,
  solar,
  lunar,
}: {
  patternKey: DecisionPattern;
  styleKey: OperatingStyle;
  patternLabel: string;
  styleLabel: string;
  solar: Axis;
  lunar: Axis;
}) {
  const protection = decisionMapDetails[patternKey].protection;
  const condition = operatingConditionDetails[styleKey];

  return `<tr><td style="padding:8px 34px 28px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f4;border:1px solid #cddbd2;"><tr><td style="padding:24px 22px 8px;"><h2 style="margin:0;color:#17201e;font-size:24px;line-height:1.35;font-weight:400;letter-spacing:-.45px;">你的決策承接圖</h2><p style="margin:10px 0 0;color:#52615b;font-size:14px;line-height:1.75;">不是市場答案，而是你在不確定裡，如何走向一個決定。</p></td></tr><tr><td style="padding:16px 22px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="50%" valign="top" style="padding:0 6px 0 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e2ede5;"><tr><td style="padding:14px 13px;"><p style="margin:0 0 6px;color:#4f7567;font-size:10px;letter-spacing:1.1px;">外界訊號進來時</p><p style="margin:0 0 7px;color:#17201e;font-size:14px;line-height:1.45;font-weight:600;">陽曆 ${escapeHtml(solar.path)}</p><p style="margin:0;color:#31443d;font-size:13px;line-height:1.65;">${escapeHtml(solar.title)}</p></td></tr></table></td><td width="50%" valign="top" style="padding:0 0 0 6px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1e5df;"><tr><td style="padding:14px 13px;"><p style="margin:0 0 6px;color:#853e32;font-size:10px;letter-spacing:1.1px;">真正要行動時</p><p style="margin:0 0 7px;color:#17201e;font-size:14px;line-height:1.45;font-weight:600;">陰曆 ${escapeHtml(lunar.path)}</p><p style="margin:0;color:#493a36;font-size:13px;line-height:1.65;">${escapeHtml(lunar.title)}</p></td></tr></table></td></tr></table></td></tr><tr><td align="center" style="padding:12px 22px 10px;color:#4f7567;font-size:20px;line-height:1;">↓</td></tr><tr><td style="padding:0 22px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#17201e;"><tr><td style="padding:17px 18px;"><p style="margin:0 0 7px;color:#a8c3b6;font-size:10px;letter-spacing:1.15px;">14 題作答的第一手證據</p><p style="margin:0 0 6px;color:#ffffff;font-size:20px;line-height:1.35;font-weight:400;">${escapeHtml(patternLabel)}</p><p style="margin:0;color:#d6e0da;font-size:13px;line-height:1.7;">不確定一來，你最先想保護的是：${escapeHtml(protection)}。</p></td></tr></table></td></tr><tr><td align="center" style="padding:12px 22px 10px;color:#4f7567;font-size:20px;line-height:1;">↓</td></tr><tr><td style="padding:0 22px 16px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #d6e1db;"><tr><td style="padding:15px 17px;"><p style="margin:0 0 7px;color:#4f7567;font-size:10px;letter-spacing:1.15px;">以現實條件校對，不從慣性推導</p><p style="margin:0 0 6px;color:#17201e;font-size:17px;line-height:1.45;font-weight:400;">${escapeHtml(styleLabel)}</p><p style="margin:0;color:#52615b;font-size:13px;line-height:1.7;">${escapeHtml(condition)}</p></td></tr></table></td></tr><tr><td style="padding:0 22px 20px;"><p style="margin:0;color:#31443d;font-size:15px;line-height:1.8;">數字描述你的預設反應順序；14 題讓你看見慣性如何接手；操作條件則提醒你，現在可以承接什麼節奏。</p></td></tr></table></td></tr>`;
}

export function buildDecisionDossier(input: DossierInput) {
  const pattern = patternDetails[input.pattern];
  const style = styleDetails[input.style];
  const solar = input.solar;
  const lunar = input.lunar;
  const decisionMapText = section("你的決策承接圖", `陽曆 ${solar.path} 描述你面對外界訊號時的預設反應順序；陰曆 ${lunar.path} 描述你真正要行動、承受壓力時的反應順序。14 題作答顯示你的慣性是「${pattern.label}」，最先想保護的是「${decisionMapDetails[input.pattern].protection}」。再以目前條件校對，你較能承接「${style.label}」。`);
  const decisionMapHtml = buildDecisionMapHtml({
    patternKey: input.pattern,
    styleKey: input.style,
    patternLabel: pattern.label,
    styleLabel: style.label,
    solar,
    lunar,
  });
  const sections = [
    section("這不是一份投資答案，而是一張你的決策底圖", `你這次最常出現的決策慣性是「${pattern.label}」，而目前條件較接近「${style.label}」。這兩個結果要一起看：前者描述你在不確定裡容易怎麼反應，後者看的是你的時間、資金、等待方式與準備度。它們不是人格標籤，更不替你決定該買什麼；它們讓你看見，當市場、關係或工作突然出現壓力時，哪一個內在反應最容易先接管。能看見慣性，不是為了責怪自己，而是為了在下一次反應發生前，多留一點選擇的空間。`),
    section("為什麼股票能照出你的初始設定", `任何決策都有三個起點：你先接收哪些訊號、最先想保護什麼，以及要多確定才會行動。它們平常藏在生活裡，很難察覺；股市卻用真金白銀與即時回饋把它們放大，因為每一次買或不買，都是對風險與等待的即時回應。同一則利多消息，怕錯過的人先怕來不及，借用答案的人先看群組，撐住的人先守原判斷，觀察的人先問依據。生命數字描述的不是交易結果，而是這些預設反應順序；不確定性一來，反應慣性便影響決策。`),
    section("你的決策慣性：先看見力量，再看見慣性", `${pattern.strength}\n\n${pattern.blindSpot}\n\n這個模式不只會出現在股票。當你面對工作機會、關係裡的拉扯、金錢壓力或家人期待時，同一個反應常會換一個情境再出現。你要觀察的不是『我是不是又做錯了』，而是：我一感到不確定，最先想保護的是安全、認同、投入，還是掌控感？當這個問題被說清楚，你就不必每一次都從情緒最滿的地方開始做決定。`),
    section("你目前的操作節奏：條件比衝動更重要", `${style.insight}\n\n${style.boundary}\n\n股票是一個很誠實的情境，因為它會把人的等待、急迫、比較、控制與害怕放大。但這份結果不提供標的、不預測報酬，也不是個別投資建議。真正有價值的部分是：在你想做任何交易前，先確認這個決定符合你的時間、資金與規則，而不是只符合當下的感覺。能承接的節奏，永遠比看起來厲害的節奏重要。`),
    section("生命數字描述初始設定，不替你下人生結論", `你剛剛在 14 題裡選出的慣性，是你自己給出的第一手證據：在不確定裡，你會先注意什麼、想保護什麼，又要多確定才願意動。生命數字只是第二層的解釋；它回答的不是「你會怎麼交易」，而是「為什麼這個慣性你早就知道，卻很難只靠意志力改變」。數字描述你的預設反應順序；當不確定性升高，這個反應慣性會先接手，進而影響決策。它不預測市場、不決定結果，也不比你的覺察、知識與練習更有力量。它的用途，是讓你在反應啟動時更快認出自己，而不是把人生交給一個分類。`),
    section(`陽曆 ${solar.path}：${solar.role}`, `${solar.title}。${solar.body}\n\n盤面急漲的三分鐘、群組有人喊進的時候，外界的聲音很強，你會如何說服自己？回頭看剛剛的答題反應：你先抓住機會、先找人確認、先守住原判斷，還是先拉開距離看依據？陽曆這一軸描述的，是你在外在壓力下的預設反應順序；這個不確定性下的反應慣性，才會影響你怎麼理解訊號、怎麼在眾聲裡為自己找到理由。${solar.prompt}`),
    section(`陰曆 ${lunar.path}：${lunar.role}`, `${lunar.title}。${lunar.body}\n\n真正要按下買賣鍵時，或帳面虧損進入第五天晚上、想加碼攤平的念頭出現時，情緒會怎麼接手？回頭看剛剛的答題反應：你是急著止住不安、等別人確認、繼續撐住，還是先把條件重新攤開？陰曆這一軸描述的，是情緒接手時的預設反應順序；不確定性下的反應慣性，才會影響你怎麼面對壓力、怎麼按下或暫停那個鍵。${lunar.prompt}`),
    section("兩條軸線放在一起：你怎麼從想法走到行動", `陽曆顯示的是你比較習慣用什麼方式理解世界、表現自己；陰曆則照見你在需要承擔時，情緒與行動會怎麼接手。如果你這次測出的慣性是 ${pattern.label}，回頭看這兩軸，你大概能認出它是從哪裡長出來的；再對照你目前的操作條件，就能把慣性、條件與數字放回同一個脈絡，而不是當成三份獨立報告。這兩條線有時一致，有時互相拉扯。當它們拉扯時，你可能表面很篤定，內在卻一直不安，或心裡早有感覺，行動卻遲遲沒有開始。重要決定要同時問過外在的理由與內在的承受，才不會把自己推得太快，或留得太久。`),
    section("下一次卡住時，用三層把自己帶回來", `先分三層：事實，是可驗證的價格與訊息；感受，是急、怕、想證明或捨不得；行動，則是觀察、補資料、小驗證或暫時不動。感受不需要被否定，但不能假裝成事實。每次把三層拆開，你就能從自動反應回到有意識的選擇。`),
    section("怎麼使用這份報告，才不會又變成另一個標籤", `第一次讀完，先圈出最有感的一句，不必急著把所有提醒都做到。下一次面對重要決定，再回來看：我此刻是哪一個慣性？外在的理由正在怎麼說服我？情緒又想把我帶往哪裡？最後只選一個最小、可承受的動作。\n\n這不是一次看完就結束的答案，而是一面可重複使用的鏡子。每一次比上一次早一點認出反應，你就多拿回一點選擇。`),
    section("接下來七天，請做一個小實驗", `${style.practice}\n\n再加上一個屬於你的暫停句：${pattern.reset}\n\n每次重要決定前，不必一次把自己變成完全不同的人。只要先多留三十秒，把事實、感受與下一步分開。你會慢慢發現：不是情緒不能出現，而是情緒出現後，你仍然可以選擇不立刻把方向交出去。`),
    section("最後想留給你", `這份「決策底圖」不是要你從此不犯錯。成熟的決策不是永遠選對，而是即使結果還不知道，你也越來越能說清楚：我為什麼這樣選、我願意承擔什麼、出現什麼訊號時我會重新看。股票只是這段練習的入口。當你開始看見自己如何怕錯過、借用答案、撐住或停下來觀察，這份理解也會回到金錢、關係、工作與你真正想過的人生裡。`),
  ];

  const text = [decisionMapText, ...sections].join("\n\n");
  const htmlSections = sections
    .map((item) => {
      const [heading, ...paragraphs] = item.split("\n");
      return `<tr><td style="padding:0 0 26px;"><h2 style="margin:0 0 12px;color:#17201e;font-size:20px;line-height:1.45;font-weight:400;letter-spacing:-.35px;">${escapeHtml(heading.replace(/[【】]/g, ""))}</h2>${paragraphs.map((paragraph) => `<p style="margin:0 0 12px;color:#52615b;font-size:15px;line-height:1.9;">${escapeHtml(paragraph)}</p>`).join("")}</td></tr>`;
    })
    .join("");
  const subject = "你的決策底圖｜一份關於你如何做決定的完整解讀";
  const preview = "把你的決策慣性、操作條件與雙軸生命數字，放回同一張圖裡看。";
  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>你的決策底圖｜NAS</title></head><body style="margin:0;background:#eef2ee;font-family:-apple-system,BlinkMacSystemFont,'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif;color:#17201e;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preview}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2ee;"><tr><td style="padding:28px 14px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:auto;background:#ffffff;"><tr><td style="padding:34px 34px 30px;background:#17201e;color:#ffffff;"><p style="margin:0 0 22px;color:#a8c3b6;font-size:11px;letter-spacing:1.8px;">NAS · NOAGE SPACE</p><p style="margin:0 0 9px;color:#d7644e;font-size:12px;letter-spacing:1.4px;">你的免費深度解讀</p><h1 style="margin:0;color:#ffffff;font-size:34px;line-height:1.22;font-weight:400;letter-spacing:-1px;">你的決策底圖</h1><p style="margin:14px 0 0;color:#d6e0da;font-size:15px;line-height:1.7;">把當下慣性、操作條件與生命數字的初始設定，放回同一張圖裡看。</p></td></tr><tr><td style="padding:30px 34px 8px;"><p style="margin:0 0 8px;color:#4f7567;font-size:11px;letter-spacing:1.4px;">本次結果</p><p style="margin:0;color:#17201e;font-size:20px;line-height:1.55;">${escapeHtml(pattern.label)} · ${escapeHtml(style.label)}</p></td></tr>${decisionMapHtml}<tr><td style="padding:20px 34px 18px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #dce4df;">${htmlSections}</table></td></tr><tr><td style="padding:26px 34px;background:#e5ede7;"><p style="margin:0 0 8px;color:#4f7567;font-size:11px;letter-spacing:1.4px;">NAS 提醒</p><p style="margin:0;color:#52615b;font-size:13px;line-height:1.75;">數字是理解自己的工具，不是限制你的答案。這份內容不構成投資建議、不推薦標的，也不對任何結果作出承諾。</p></td></tr></table></td></tr></table></body></html>`;

  return { title: "你的決策底圖｜NAS 免費深度解讀", subject, preview, text, html, characterCount: text.replace(/\s/g, "").length };
}
