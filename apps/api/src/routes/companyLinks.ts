import { Hono } from 'hono';
import { CompanyCareerLink } from '@velmurugan/shared';
import { createDbClient, companyCareerLinks } from '@velmurugan/db';
import { eq } from 'drizzle-orm';
import { Env } from '../types.js';
import { loadLocalCompanyLinks, saveLocalCompanyLinks } from '../services/localStorage.js';

export const companyLinksRouter = new Hono<{ Bindings: Env }>();

companyLinksRouter.get('/', async (c) => {
  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      const dbLinks = await db.select().from(companyCareerLinks);
      if (dbLinks.length > 0) {
        const links: CompanyCareerLink[] = dbLinks.map(link => ({
          id: link.id,
          companyName: link.companyName,
          careerUrl: link.careerUrl,
          isActive: link.isActive,
          lastScannedAt: link.lastScannedAt ? new Date(link.lastScannedAt).toISOString() : undefined,
          createdAt: link.createdAt ? new Date(link.createdAt).toISOString() : new Date().toISOString()
        }));
        return c.json({ companyLinks: links });
      }
    } catch (err) {
      console.error('Error fetching company links from Neon DB:', err);
    }
  }

  // Fallback / Local persistent disk storage
  const localLinks = loadLocalCompanyLinks();
  return c.json({ companyLinks: localLinks });
});

companyLinksRouter.post('/', async (c) => {
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

  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      await db.insert(companyCareerLinks).values({
        id: newLink.id,
        companyName: newLink.companyName,
        careerUrl: newLink.careerUrl,
        isActive: newLink.isActive
      });
      console.log('Saved company career link to Neon DB:', newLink.companyName);
    } catch (err) {
      console.error('Error inserting company link to Neon DB:', err);
    }
  }

  // Always persist to local disk database so restarting npm run dev never erases links!
  const current = loadLocalCompanyLinks();
  current.push(newLink);
  saveLocalCompanyLinks(current);

  return c.json({ success: true, companyLink: newLink });
});

companyLinksRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  if (c.env.DATABASE_URL) {
    try {
      const db = createDbClient(c.env.DATABASE_URL);
      await db.delete(companyCareerLinks).where(eq(companyCareerLinks.id, id));
      console.log('Deleted company career link from Neon DB:', id);
    } catch (err) {
      console.error('Error deleting company link from Neon DB:', err);
    }
  }

  // Always update local disk database
  const current = loadLocalCompanyLinks();
  const filtered = current.filter(l => l.id !== id);
  saveLocalCompanyLinks(filtered);

  return c.json({ success: true, message: 'Career link removed' });
});
