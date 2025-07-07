import jwt from 'jsonwebtoken';

export default function authMiddleware(handler) {
  return async (req, res) => {

      if (req.method === 'OPTIONS') return handler(req, res);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
}
