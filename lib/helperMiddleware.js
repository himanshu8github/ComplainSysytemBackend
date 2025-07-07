export default function helperMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        return result instanceof Error ? reject(result) : resolve(result);
      });
    });
}
