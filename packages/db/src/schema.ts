import { pgTable, text, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  yoe: integer('yoe').notNull().default(3),
  targetJobTitles: jsonb('target_job_titles').$type<string[]>().notNull(),
  skills: jsonb('skills').$type<string[]>().notNull(),
  experienceSummary: jsonb('experience_summary').$type<string[]>().notNull(),
  education: jsonb('education').notNull(),
  linkedInCookie: text('linkedin_cookie'),
  telegramBotToken: text('telegram_bot_token'),
  telegramChatId: text('telegram_chat_id'),
  masterPdfBase64: text('master_pdf_base64'),
  layoutTheme: jsonb('layout_theme'),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const companyCareerLinks = pgTable('company_career_links', {
  id: text('id').primaryKey(),
  companyName: text('company_name').notNull(),
  careerUrl: text('career_url').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  lastScannedAt: timestamp('last_scanned_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  linkedinJobId: text('linkedin_job_id').notNull().unique(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  description: text('description').notNull(),
  yoeRequired: text('yoe_required'),
  isEasyApply: boolean('is_easy_apply').notNull().default(false),
  url: text('url').notNull(),
  scannedAt: timestamp('scanned_at').defaultNow()
});

export const applications = pgTable('applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull().references(() => jobs.id),
  linkedinJobId: text('linkedin_job_id').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  status: text('status').notNull(),
  isEasyApply: boolean('is_easy_apply').notNull().default(false),
  matchScore: real('match_score').notNull(),
  yoeRequired: text('yoe_required'),
  resumeId: text('resume_id'),
  redirectUrl: text('redirect_url'),
  appliedAt: timestamp('applied_at').defaultNow()
});

export const resumes = pgTable('resumes', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull().references(() => jobs.id),
  tailoredSummary: text('tailored_summary').notNull(),
  tailoredBullets: jsonb('tailored_bullets').$type<string[]>().notNull(),
  keywordsAdded: jsonb('keywords_added').$type<string[]>().notNull(),
  atsScore: real('ats_score').notNull(),
  pdfHtmlContent: text('pdf_html_content').notNull(),
  latexCode: text('latex_code'),
  createdAt: timestamp('created_at').defaultNow()
});

export const cronLogs = pgTable('cron_logs', {
  id: text('id').primaryKey(),
  status: text('status').notNull(),
  jobsScanned: integer('jobs_scanned').default(0),
  appliedCount: integer('applied_count').default(0),
  redirectedCount: integer('redirected_count').default(0),
  message: text('message'),
  executedAt: timestamp('executed_at').defaultNow()
});
