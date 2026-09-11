import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // 1. Allow if matching server admin secret key
  if (key && key === process.env.ADMIN_KEY) {
    return next();
  }

  // 2. Allow if valid admin JWT session token
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'bg-portfolio-jwt-super-secret-key-2024'
      );
      if (decoded && decoded.role === 'admin') {
        req.user = decoded;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired session token.' });
    }
  }

  return res.status(401).json({ message: 'Unauthorized: Admin authentication required.' });
};

export default adminAuth;
