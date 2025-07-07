import Cors from 'cors';

const corsMiddleware = Cors({
  origin: 'https://complaint-management-frontend-roan.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

export default corsMiddleware;