import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types.js';
import { healthRouter } from './routes/health.js';
import { statsRouter } from './routes/stats.js';
import { profileRouter } from './routes/profile.js';
import { companyLinksRouter } from './routes/companyLinks.js';
import { applicationsRouter } from './routes/applications.js';
import { jobsRouter } from './routes/jobs.js';
import { runJobAutomationPipeline } from './services/pipeline.js';

export type { Env };

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// Modular Route Mounts
app.route('/api/health', healthRouter);
app.route('/api/stats', statsRouter);
app.route('/api/profile', profileRouter);
app.route('/api/company-links', companyLinksRouter);
app.route('/api/applications', applicationsRouter);
app.route('/api/jobs', jobsRouter);

export default {
  fetch: app.fetch,

  async scheduled(event: { cron: string; scheduledTime: number }, env: Env, ctx: { waitUntil: (p: Promise<any>) => void }) {
    console.log(`Cloudflare Cron Trigger fired at ${new Date(event.scheduledTime).toISOString()}`);
    ctx.waitUntil(runJobAutomationPipeline(env));
  }
};
