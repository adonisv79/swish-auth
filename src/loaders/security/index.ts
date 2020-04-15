// These security implementations allow us to prevent data leak and attacks from hackers.
// Guides include best practices from https://expressjs.com/en/advanced/best-practice-security.html
import { Express } from 'express';
import helmet from 'helmet';
import rlimitMiddleware from './RateLimit';

export default async function loadSecurity(app: Express): Promise<void> {
  app.use(helmet());
  app.use(rlimitMiddleware);
}
