const authorizeRooles = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "You do not have permission" });
  }

  next();
};

module.exports = authorizeRooles;
