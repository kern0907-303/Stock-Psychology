import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Raw birth dates are intentionally never stored. The paths below contain only
 * the calculated NAS display paths (for example 30/3 and 22/4).
 */
export const decisionDossiers = sqliteTable("decision_dossiers", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  pattern: text("pattern").notNull(),
  operationStyle: text("operation_style").notNull(),
  solarPath: text("solar_path").notNull(),
  lunarPath: text("lunar_path").notNull(),
  reportTitle: text("report_title").notNull(),
  reportHtml: text("report_html").notNull(),
  reportText: text("report_text").notNull(),
  reportCharacterCount: integer("report_character_count").notNull(),
  deliveryStatus: text("delivery_status").notNull().default("pending"),
  reportConsentAt: text("report_consent_at").notNull(),
  marketingConsent: integer("marketing_consent").notNull().default(0),
  consentVersion: text("consent_version").notNull(),
  source: text("source").notNull().default("quiz-result"),
  createdAt: text("created_at").notNull(),
});
