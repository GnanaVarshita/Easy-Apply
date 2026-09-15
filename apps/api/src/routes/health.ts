import { Hono } from 'hono';
import { Env } from '../types.js';

export const healthRouter = new Hono<{ Bindings: Env }>();

healthRouter.get('/', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});
