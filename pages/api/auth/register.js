
import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import runMiddleware from '../../../lib/helperMiddleware';
import corsMiddleware from '../../../lib/corsMiddleware';

export default async function handler(req, res) {
    await runMiddleware(req, res, corsMiddleware);

      if (req.method === 'OPTIONS') {
    return res.status(200).end(); 
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, role } = req.body;

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
