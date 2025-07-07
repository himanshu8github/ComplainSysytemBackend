import connect from '../../../lib/db';
import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import run from '../../../lib/helperMiddleware';
import cors from '../../../lib/corsMiddleware';

export default async function handler(req, res) {
  await run(req, res, cors);
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  await connect();
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } });
}
