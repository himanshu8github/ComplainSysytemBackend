import Cors from 'cors';
import initMiddleware from './helperMiddleware';

const cors = initMiddleware(
  Cors({
    origin: [
      '*',
      'http://localhost:5173',
      'https://complaint-management-frontend-roan.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

export default cors;
