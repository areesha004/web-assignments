export const adminOnly = (req, res, next) => {
  const userEmail = req.body.email || req.user?.email;

  if (userEmail !== "admin@shop.com") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); 
};
