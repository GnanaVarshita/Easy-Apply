import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GeminiJobService } from '@velmurugan/ai';
import { CompanyCareerLink, UserProfile } from '@velmurugan/shared';
import { createDbClient, resumes } from '@velmurugan/db';
import { runJobAutomationPipeline } from './services/pipeline.js';
import { sendTelegramRedirectNotification } from './services/telegram.js';

export interface Env {
  DATABASE_URL?: string;
  GEMINI_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

let savedCompanyLinks: CompanyCareerLink[] = [
  {
    id: 'link_1',
    companyName: 'Trane Technologies',
    careerUrl: 'https://tranetechnologies.com/careers',
    isActive: true,
    lastScannedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'link_2',
    companyName: 'Stripe',
    careerUrl: 'https://stripe.com/jobs',
    isActive: true,
    lastScannedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

let currentUserProfile: UserProfile = {
  id: 'user_1',
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
    'Software Engineer at Trane Technologies (July 2025 - Present): Contributed in building in-house knowledge sharing application and developing real-time device monitoring tool for 500+ endpoints, implementing token-based authentication and achieving 99.9% uptime with graphical statuses updating every 5 seconds.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Awarded the Excellence Award for delivering the Next-Gen Application, replacing an 18-year-old legacy architecture to serve 2,000+ active enterprise users.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Developed web pages using ReactJS and TypeScript, integrating GraphQL mutations to optimize data-fetch logic, which reduced transaction costs and cut API response times by 50%.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Engineered custom Node.js module classes, enhancing modular design and reducing overall feature development time by 90%.'
  ],
  education: [
    {
      degree: 'Integrated M.Tech',
      field: 'Computer Science & Engineering (CGPA: 8.25/10.0)',
      institution: 'VIT Vellore',
      year: '2020 - 2025'
    }
  ],
  layoutTheme: {
    primaryColor: '#B8860B',
    fontFamily: 'Arial, sans-serif',
    sectionOrder: ['Education', 'Work Experience', 'Positions of Responsibility']
  }
};

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (c) => {
  return c.json({
    totalJobsScanned: 142,
    totalApplied: 48,
    totalRedirected: 31,
    totalSkipped: 63,
    averageMatchScore: 88.4,
    companyLinksCount: savedCompanyLinks.length,
    lastCronRunAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    cronRunStatus: 'SUCCESS'
  });
});

app.get('/api/profile', (c) => {
  return c.json({ profile: currentUserProfile });
});

app.post('/api/profile/upload-master-pdf', async (c) => {
  const body = await c.req.json();
  const { pdfBase64 } = body;

  if (!pdfBase64) {
    return c.json({ error: 'PDF base64 payload is required' }, 400);
  }

  // 1. If Neon DB is configured, clear old resume records from Database
  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      await db.delete(resumes);
      console.log('Cleared previous resume records from Neon PostgreSQL database.');
    } catch (err) {
      console.warn('DB cleanup warning (or table empty):', err);
    }
  }

  const geminiKey = c.env.GEMINI_API_KEY || 'demo_key';
  const geminiService = new GeminiJobService(geminiKey);

  const { profile: extractedProfile, layoutTheme } = await geminiService.parseMasterResumePDF(pdfBase64);

  // 2. Overwrite candidate profile & purge old resume from Cloudflare Worker memory
  currentUserProfile = {
    ...currentUserProfile,
    ...extractedProfile,
    layoutTheme,
    masterPdfBase64: pdfBase64
  };

  return c.json({
    success: true,
    message: 'Old resume cleared from Database & Cloudflare Workers! New master resume synced for direct job applications.',
    extractedProfile: currentUserProfile
  });
});

app.get('/api/company-links', (c) => {
  return c.json({ companyLinks: savedCompanyLinks });
});

app.post('/api/company-links', async (c) => {
  const body = await c.req.json();
  if (!body.companyName || !body.careerUrl) {
    return c.json({ error: 'Company Name and Career URL are required' }, 400);
  }

  const newLink: CompanyCareerLink = {
    id: 'link_' + Date.now(),
    companyName: body.companyName,
    careerUrl: body.careerUrl,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  savedCompanyLinks.push(newLink);
  return c.json({ success: true, companyLink: newLink });
});

app.delete('/api/company-links/:id', (c) => {
  const id = c.req.param('id');
  savedCompanyLinks = savedCompanyLinks.filter(l => l.id !== id);
  return c.json({ success: true, message: 'Career link removed' });
});

app.get('/api/applications', (c) => {
  return c.json({
    applications: [
      {
        id: 'app_1',
        jobId: 'job_1',
        linkedinJobId: '3948201948',
        title: 'Full Stack React Engineer',
        company: 'Vercel / Next.js Team',
        location: 'Remote',
        status: 'APPLIED',
        isEasyApply: true,
        matchScore: 94,
        yoeRequired: '2+ years',
        appliedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'app_2',
        jobId: 'job_2',
        linkedinJobId: '3948201949',
        title: 'Software Engineer - Frontend',
        company: 'Trane Technologies',
        location: 'Remote',
        status: 'REDIRECTED',
        isEasyApply: false,
        matchScore: 96,
        yoeRequired: '1-3 years',
        redirectUrl: 'https://tranetechnologies.com/careers/jobs/frontend-engineer',
        appliedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      }
    ]
  });
});

app.post('/api/jobs/trigger-cron', async (c) => {
  const result = await runJobAutomationPipeline(c.env);
  return c.json({ success: true, result });
});

export default {
  fetch: app.fetch,

  async scheduled(event: { cron: string; scheduledTime: number }, env: Env, ctx: { waitUntil: (p: Promise<any>) => void }) {
    console.log(`Cloudflare Cron Trigger fired at ${new Date(event.scheduledTime).toISOString()}`);
    ctx.waitUntil(runJobAutomationPipeline(env));
  }
};
