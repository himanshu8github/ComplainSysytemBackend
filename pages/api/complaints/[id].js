import connectToDatabase from '../../../lib/db';
import Complaint from '../../../models/Complaint';
import authMiddleware from '../../../lib/authMiddleware';
import { sendMail } from '../../../lib/mailer';
import runMiddleware from '../../../lib/helperMiddleware';
import corsMiddleware from '../../../lib/corsMiddleware';

async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await connectToDatabase();
  await runMiddleware(req, res, corsMiddleware);

  if (method === 'PUT' || method === 'DELETE') {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  }

  switch (method) {
    case 'PUT':
      try {
        const existingComplaint = await Complaint.findById(id);
        if (!existingComplaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }

        const prevStatus = existingComplaint.status;
        const updatedComplaint = await Complaint.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true }
        );

        if (req.body.status === 'Resolved' && prevStatus !== 'Resolved') {
          await sendMail({
            to: 'himanshutestingemail88@gmail.com',
            subject: `Complaint Resolved: ${updatedComplaint.title}`,
            html: `
              <h3>Your Complaint Has Been Resolved</h3>
              <p><strong>Title:</strong> ${updatedComplaint.title}</p>
              <p><strong>Status:</strong> ${updatedComplaint.status}</p>
              <p><strong>Resolution Time:</strong> ${new Date().toLocaleString()}</p>
            `,
          });
        }

        return res.status(200).json({
          message: 'Complaint updated successfully',
          complaint: updatedComplaint,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to update complaint', error });
      }

    case 'DELETE':
      try {
        const deletedComplaint = await Complaint.findByIdAndDelete(id);

        if (!deletedComplaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }

        return res.status(200).json({ message: 'Complaint deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to delete complaint', error });
      }

    default:
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

export default authMiddleware(handler);
