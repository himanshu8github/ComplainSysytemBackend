import Cors from 'cors';
import runMiddleware from '../../../lib/helperMiddleware';
import connectToDatabase from '../../../lib/db';
import Complaint from '../../../models/Complaint';
import { sendMail } from '../../../lib/mailer';
import authMiddleware from '../../../lib/authMiddleware';


const corsMiddleware = Cors({
  methods: ['GET', 'POST'],
  origin: '*',
});


async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware); 
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { title, description, category, priority } = req.body;
      console.log("Incoming data:", req.body);

      if (!title || !description || !category || !priority) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newComplaint = new Complaint({
        title,
        description,
        category,
        priority,
      });

      await newComplaint.save();

      await sendMail({
        to: 'himanshutestingemail88@gmail.com',
        subject: 'New Complaint Submitted',
        html: `
          <h2>New Complaint Submitted</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Description:</strong> ${description}</p>
        `,
      });

      return res.status(201).json({ message: 'Complaint submitted successfully' });
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    try {
      const complaints = await Complaint.find().sort({ dateSubmitted: -1 });
      return res.status(200).json(complaints);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default authMiddleware(handler);
