import Cors from 'cors';

const corsMiddleware = Cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

export default corsMiddleware;