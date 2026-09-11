import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

// POST /api/auth/google — Verify Google token & issue admin JWT session
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Missing Google credential token.' });
  }

  try {
    let email = '';
    let name = '';
    let picture = '';

    // If GOOGLE_CLIENT_ID is configured, verify with Google Auth Library
    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(401).json({ message: 'Invalid Google token payload.' });
      }
      email = payload.email.toLowerCase();
      name = payload.name || '';
      picture = payload.picture || '';
    } else {
      // Decode JWT payload directly (base64 URL) if client ID is still being set up
      const parts = credential.split('.');
      if (parts.length < 2) {
        return res.status(400).json({ message: 'Malformed credential token.' });
      }
      const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
      const payload = JSON.parse(payloadStr);
      email = (payload.email || '').toLowerCase();
      name = payload.name || '';
      picture = payload.picture || '';
    }

    const authorizedAdminEmail = (process.env.ADMIN_EMAIL || 'bg6951872@gmail.com').toLowerCase().trim();

    // Check if the authenticated Google email matches the admin email
    if (email !== authorizedAdminEmail) {
      return res.status(403).json({
        message: `Access denied: Account ${email} is not authorized as an administrator.`,
      });
    }

    // Sign admin JWT session token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'bg-portfolio-jwt-super-secret-key-2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      email,
      name,
      picture,
    });
  } catch (err) {
    console.error('Error during Google authentication:', err);
    res.status(401).json({ message: 'Google authentication failed: ' + err.message });
  }
});

// GET /api/auth/verify — Verify existing admin session token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No session token provided.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'bg-portfolio-jwt-super-secret-key-2024'
    );
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid or expired session token.' });
  }
});

export default router;
