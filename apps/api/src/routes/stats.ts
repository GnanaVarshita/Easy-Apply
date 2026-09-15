import { Hono } from 'hono';
import { createDbClient, companyCareerLinks, applications } from '@velmurugan/db';
import { ApplicationRecord } from '@velmurugan/shared';
import { Env } from '../types.js';
import { loadLocalCompanyLinks, loadLocalApplications } from '../services/localStorage.js';

export const statsRouter = new Hono<{ Bindings: Env }>();

statsRouter.get('/', async (c) => {
  let companyLinksCount = loadLocalCompanyLinks().length;
  let allApps: ApplicationRecord[] = loadLocalApplications();

  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      const dbLinks = await db.select().from(companyCareerLinks);
      if (dbLinks.length > 0) {
        companyLinksCount = dbLinks.length;
      }

      const dbApps = await db.select().from(applications);
      if (dbApps.length > 0) {
        allApps = dbApps.map(a => ({
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
      }
    } catch (err) {
      console.error('Error fetching dynamic stats from Neon DB:', err);
    }
  }

  const totalApplied = allApps.filter(a => a.status === 'APPLIED').length;
  const totalRedirected = allApps.filter(a => a.status === 'REDIRECTED').length;
  const totalSkipped = allApps.filter(a => a.status.startsWith('SKIPPED')).length;
  const totalJobsScanned = allApps.length;

  const averageMatchScore = allApps.length > 0
    ? Math.round((allApps.reduce((acc, a) => acc + (a.matchScore || 0), 0) / allApps.length) * 10) / 10
    : 0;

  const sortedApps = [...allApps].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  const latestApp = sortedApps[0];

  return c.json({
    totalJobsScanned,
    totalApplied,
    totalRedirected,
    totalSkipped,
    averageMatchScore,
    companyLinksCount,
    lastCronRunAt: latestApp ? latestApp.appliedAt : undefined,
    cronRunStatus: 'SUCCESS'
  });
});
