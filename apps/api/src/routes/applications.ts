import { Hono } from 'hono';
import { ApplicationRecord } from '@velmurugan/shared';
import { createDbClient, applications } from '@velmurugan/db';
import { Env } from '../types.js';
import { savedApplications } from '../store.js';

export const applicationsRouter = new Hono<{ Bindings: Env }>();

applicationsRouter.get('/', async (c) => {
  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      const dbApps = await db.select().from(applications);
      if (dbApps.length > 0) {
        const appRecords: ApplicationRecord[] = dbApps.map(a => ({
          id: a.id,
          jobId: a.jobId,
          linkedinJobId: a.linkedinJobId,
          title: a.title,
          company: a.company,
          location: a.location || 'Remote',
          status: a.status as any,
          isEasyApply: a.isEasyApply,
          matchScore: a.matchScore,
          yoeRequired: a.yoeRequired || undefined,
          resumeId: a.resumeId || undefined,
          redirectUrl: a.redirectUrl || undefined,
          appliedAt: a.appliedAt ? new Date(a.appliedAt).toISOString() : new Date().toISOString()
        }));
        return c.json({ applications: appRecords });
      }
    } catch (err) {
      console.error('Error fetching applications from DB:', err);
    }
  }
  return c.json({ applications: savedApplications });
});
