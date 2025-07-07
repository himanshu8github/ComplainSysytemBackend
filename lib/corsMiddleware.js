import Cors from 'cors';

// Set allowed origin and methods
const cors = Cors({
  origin: 'https://complaint-management-frontend-roan.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Wrapper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export { cors, runMiddleware };
