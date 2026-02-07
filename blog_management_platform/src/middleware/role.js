export const authorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userId || !req.userRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user credentials found",
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
