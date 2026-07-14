CREATE TABLE `decision_dossiers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`pattern` text NOT NULL,
	`operation_style` text NOT NULL,
	`solar_path` text NOT NULL,
	`lunar_path` text NOT NULL,
	`report_title` text NOT NULL,
	`report_html` text NOT NULL,
	`report_text` text NOT NULL,
	`report_character_count` integer NOT NULL,
	`delivery_status` text DEFAULT 'pending' NOT NULL,
	`report_consent_at` text NOT NULL,
	`marketing_consent` integer DEFAULT 0 NOT NULL,
	`consent_version` text NOT NULL,
	`source` text DEFAULT 'quiz-result' NOT NULL,
	`created_at` text NOT NULL
);
