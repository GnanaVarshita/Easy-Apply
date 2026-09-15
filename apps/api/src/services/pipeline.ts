import { GeminiJobService } from '@velmurugan/ai';
import { createDbClient, jobs, applications, resumes, cronLogs, userProfiles } from '@velmurugan/db';
import { UserProfile, JobListing } from '@velmurugan/shared';
import { LinkedInService } from './linkedin.js';
import { sendTelegramRedirectNotification } from './telegram.js';
import { eq } from 'drizzle-orm';

export async function runJobAutomationPipeline(env: {
  DATABASE_URL?: string;
  GEMINI_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}): Promise<{
  scanned: number;
  applied: number;
  redirected: number;
  skipped: number;
  message: string;
}> {
  console.log('Starting automated job evaluation pipeline...');
  const runId = 'cron_' + Date.now();

  const geminiKey = env.GEMINI_API_KEY || 'demo_key';
  const dbUrl = env.DATABASE_URL;

  const defaultProfile: UserProfile = {
    id: 'user_default',
    name: 'GnanaVarshita Kamisetty',
    email: 'gnanavarshitagv@gmail.com',
    phone: '+91-7816037193',
    location: 'India',
    yoe: 2,
    targetJobTitles: ['Software Engineer', 'Full Stack Developer', 'React Engineer', 'Frontend Developer'],
    skills: [
      'React', 'ReactJS', 'TypeScript', 'Node.js', 'GraphQL', 'LLMs / Gemini AI',
      'Semantic Search Engine', 'Monorepo', 'REST API', 'Data Structures & Algorithms', 'OOPs', 'DBMS'
    ],
    experienceSummary: [
      'Software Engineer at Trane Technologies (July 2025 - Present): Engineered UI enhancements within extensive monorepo using React and TypeScript to align with design tokens, migrating 2 legacy modules to React and improving codebase maintainability by 30%.',
      'Software Engineer at Trane Technologies (July 2025 - Present): Developed 3 POC applications like Smart Assistant by integrating LLMs, resolving 80% of role-based user queries automatically through a natural language semantic search engine.',
      'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Awarded the Excellence Award for delivering the Next-Gen Application, replacing an 18-year-old legacy architecture to serve 2,000+ active enterprise users.'
    ],
    education: [
      {
        degree: 'Integrated M.Tech',
        field: 'Computer Science & Engineering (CGPA: 8.25/10.0)',
        institution: 'VIT Vellore',
        year: '2020 - 2025'
      }
    ],
    telegramBotToken: env.TELEGRAM_BOT_TOKEN,
    telegramChatId: env.TELEGRAM_CHAT_ID
  };

  const geminiService = new GeminiJobService(geminiKey);
  const linkedinService = new LinkedInService(defaultProfile.linkedInCookie);

  let scannedCount = 0;
  let appliedCount = 0;
  let redirectedCount = 0;
  let skippedCount = 0;

  try {
    const jobListings = await linkedinService.searchJobs(
      defaultProfile.targetJobTitles,
      defaultProfile.location
    );

    scannedCount = jobListings.length;

    for (const job of jobListings) {
      // 1. Evaluate job fit with Gemini AI
      const evaluation = await geminiService.evaluateJobFit(job, defaultProfile);
      console.log(`Job: ${job.title} | Match Score: ${evaluation.matchScore}% | Action: ${evaluation.action}`);

      if (evaluation.action === 'SKIP') {
        skippedCount++;
        continue;
      }

      // 2. Directly apply using the candidate's uploaded master resume
      const masterResumeHtml = defaultProfile.masterPdfBase64 || `<h1>${defaultProfile.name} Resume</h1>`;

      if (evaluation.action === 'APPLY' && job.isEasyApply) {
        // Execute Easy Apply directly with master resume
        const applyRes = await linkedinService.submitEasyApply(job, defaultProfile, masterResumeHtml);
        if (applyRes.success) {
          appliedCount++;
        }
      } else if (evaluation.action === 'REDIRECT' || !job.isEasyApply) {
        // External redirect application -> Send to Telegram
        redirectedCount++;
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          await sendTelegramRedirectNotification(
            env.TELEGRAM_BOT_TOKEN,
            env.TELEGRAM_CHAT_ID,
            job,
            evaluation,
            defaultProfile
          );
        }
      }
    }

    const summaryMessage = `Job automation pipeline finished. Scanned: ${scannedCount}, Applied: ${appliedCount}, Redirected to Telegram: ${redirectedCount}, Skipped: ${skippedCount}.`;
    console.log(summaryMessage);

    return {
      scanned: scannedCount,
      applied: appliedCount,
      redirected: redirectedCount,
      skipped: skippedCount,
      message: summaryMessage
    };
  } catch (err: any) {
    console.error('Error in job automation pipeline:', err);
    return {
      scanned: scannedCount,
      applied: appliedCount,
      redirected: redirectedCount,
      skipped: skippedCount,
      message: `Pipeline encountered error: ${err.message || String(err)}`
    };
  }
}
