export interface LayoutTheme {
  primaryColor?: string;
  fontFamily?: string;
  sectionOrder?: string[];
  bulletStyle?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  yoe: number;
  targetJobTitles: string[];
  skills: string[];
  experienceSummary: string[];
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year: string;
  }>;
  linkedInCookie?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  masterPdfBase64?: string;
  layoutTheme?: LayoutTheme;
}

export interface CompanyCareerLink {
  id: string;
  companyName: string;
  careerUrl: string;
  isActive: boolean;
  lastScannedAt?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'REDIRECTED'
  | 'SKIPPED_LOW_MATCH'
  | 'SKIPPED_YOE_MISMATCH'
  | 'FAILED';

export interface JobListing {
  id: string;
  linkedinJobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  isEasyApply: boolean;
  url: string;
  postedAt?: string;
  source?: string;
}

export interface JobEvaluationResult {
  jobId: string;
  linkedinJobId: string;
  title: string;
  company: string;
  matchScore: number;
  yoeRequired: string;
  yoeSuitable: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  action: 'APPLY' | 'REDIRECT' | 'SKIP';
  reason: string;
}

export interface GeneratedATSResume {
  jobId?: string;
  jobTitle?: string;
  companyName?: string;
  tailoredSummary: string;
  tailoredBullets: string[];
  keywordsAdded: string[];
  atsScore: number;
  pdfHtmlContent: string;
  latexCode: string;
  layoutTheme?: LayoutTheme;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  linkedinJobId: string;
  title: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  isEasyApply: boolean;
  matchScore: number;
  yoeRequired?: string;
  resumeId?: string;
  redirectUrl?: string;
  appliedAt: string;
}

export interface DashboardStats {
  totalJobsScanned: number;
  totalApplied: number;
  totalRedirected: number;
  totalSkipped: number;
  averageMatchScore: number;
  lastCronRunAt?: string;
  cronRunStatus: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'IDLE';
  companyLinksCount?: number;
}
