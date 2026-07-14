const patterns = new Set(["chase", "external", "hold", "observe"]);
const styles = new Set(["learn", "day", "swing", "long"]);
const consentVersion = "nas-decision-dossier-v1";

type RequestPayload = {
  email?: string;
  pattern?: string;
  style?: string;
  solarPath?: string;
  lunarPath?: string;
  reportTitle?: string;
  reportHtml?: string;
  reportText?: string;
  reportCharacterCount?: number;
  marketingConsent?: boolean;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RequestPayload;
    const email = payload.email?.trim().toLowerCase() ?? "";
    const solarPath = payload.solarPath?.trim() ?? "";
    const lunarPath = payload.lunarPath?.trim() ?? "";
    const reportTitle = payload.reportTitle?.trim() ?? "";
    const reportHtml = payload.reportHtml?.trim() ?? "";
    const reportText = payload.reportText?.trim() ?? "";
    const reportCharacterCount = Number(payload.reportCharacterCount ?? 0);

    if (!isEmail(email)) {
      return Response.json({ error: "請輸入有效的 Email。" }, { status: 400 });
    }
    if (!patterns.has(payload.pattern ?? "") || !styles.has(payload.style ?? "")) {
      return Response.json({ error: "測驗結果格式不正確，請重新完成測驗。" }, { status: 400 });
    }
    if (!/^\d{2,3}(?:\/\d{1,2})+$/.test(solarPath) || !/^\d{2,3}(?:\/\d{1,2})+$/.test(lunarPath)) {
      return Response.json({ error: "請先完成陽曆與陰曆生命數字換算。" }, { status: 400 });
    }
    if (!reportTitle || reportHtml.length < 1000 || reportText.length < 1800 || reportHtml.length > 90000 || reportText.length > 30000 || !Number.isFinite(reportCharacterCount)) {
      return Response.json({ error: "完整報告尚未準備完成，請稍後再試。" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    // Keep the Cloudflare-only D1 binding out of the SSR import graph. The
    // public questionnaire remains server-renderable without opening D1.
    const [{ getDb }, { decisionDossiers }] = await Promise.all([
      import("../../../db"),
      import("../../../db/schema"),
    ]);
    const db = getDb();
    await db.insert(decisionDossiers).values({
      id,
      email,
      pattern: payload.pattern!,
      operationStyle: payload.style!,
      solarPath,
      lunarPath,
      reportTitle,
      reportHtml,
      reportText,
      reportCharacterCount: Math.round(reportCharacterCount),
      deliveryStatus: "pending",
      reportConsentAt: now,
      marketingConsent: payload.marketingConsent ? 1 : 0,
      consentVersion,
      source: "quiz-result",
      createdAt: now,
    });

    return Response.json({ id, status: "pending" }, { status: 201 });
  } catch (error) {
    console.error("Unable to create decision dossier request", error);
    return Response.json(
      { error: "目前無法建立報告申請，請稍後再試。" },
      { status: 500 },
    );
  }
}
