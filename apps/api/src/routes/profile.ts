import { Hono } from 'hono';
import { GeminiJobService } from '@velmurugan/ai';
import { createDbClient, resumes } from '@velmurugan/db';
import { Env } from '../types.js';
import { currentUserProfile, updateCurrentUserProfile } from '../store.js';

export const profileRouter = new Hono<{ Bindings: Env }>();

profileRouter.get('/', (c) => {
  return c.json({ profile: currentUserProfile });
});

profileRouter.post('/upload-master-pdf', async (c) => {
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

  // 2. Overwrite candidate profile & purge old resume from memory
  const updated = {
    ...currentUserProfile,
    ...extractedProfile,
    layoutTheme,
    masterPdfBase64: pdfBase64
  };
  updateCurrentUserProfile(updated);

  return c.json({
    success: true,
    message: 'Old resume cleared from Database & Cloudflare Workers! New master resume synced for direct job applications.',
    extractedProfile: updated
  });
});
