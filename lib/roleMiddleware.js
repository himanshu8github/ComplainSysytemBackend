export default function roleMiddleware(allowedRoles) {
  return function (handler) {
    return async (req, res) => {
      const user = req.user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      return handler(req, res);
    };
  };
}
