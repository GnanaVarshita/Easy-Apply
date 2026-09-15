import { Hono } from 'hono';
import { Env } from '../types.js';
import { runJobAutomationPipeline } from '../services/pipeline.js';

export const jobsRouter = new Hono<{ Bindings: Env }>();

jobsRouter.post('/trigger-cron', async (c) => {
  const result = await runJobAutomationPipeline(c.env);
  return c.json({ success: true, result });
});
