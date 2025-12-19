// middlewares/checkCartNotEmpty.js
export const checkCartNotEmpty = (req, res, next) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty. Cannot proceed to checkout." });
  }

  next(); // cart is not empty, proceed
};
