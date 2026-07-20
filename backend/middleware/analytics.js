import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import Visit from '../models/Visit.js';

const analyticsMiddleware = (req, res, next) => {
  // Only track GET requests to public API endpoints
  if (req.method !== 'GET') return next();
  // Don't track admin routes
  if (req.path.startsWith('/admin')) return next();

  // Fire-and-forget — don't block the response
  try {
    const ua = new UAParser(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || '';

    // Strip IPv6 prefix
    const cleanIp = ip.replace(/^::ffff:/, '');
    const geo = geoip.lookup(cleanIp);

    const visit = new Visit({
      page: req.originalUrl || req.path,
      ip: cleanIp,
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown',
      device: ua.getDevice().type || 'Desktop',
      browser: ua.getBrowser().name || 'Unknown',
      os: ua.getOS().name || 'Unknown',
      referrer: req.headers.referer || req.headers.referrer || 'Direct'
    });

    // Save asynchronously — don't await
    visit.save().catch(err => {
      console.error('Analytics save error:', err.message);
    });
  } catch (err) {
    // Never block the response due to analytics errors
    console.error('Analytics middleware error:', err.message);
  }

  next();
};

export default analyticsMiddleware;
