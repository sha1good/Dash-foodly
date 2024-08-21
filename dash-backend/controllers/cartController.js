const Cart = require("../models/Cart");

module.exports = {
  addFoodToCart: async (req, res) => {
    const userId = req.user.id;

    const { foodId, totalPrice, quantity } = req.body;

    let count;

    try {
      const existingFood = await Cart.findOne({ userId, foodId });
      count = await Cart.countDocuments({ userId });

      if (existingFood) {
        existingFood.quantity += 1;
        (existingFood.totalPrice += totalPrice), await existingFood.save();
      } else {
        const newCart = new Cart({
          userId: userId,
          foodId: req.body.foodId,
          additives: req.body.additives,
          instructions: req.body.instructions,
          totalPrice: req.body.totalPrice,
          quantity: quantity,
        });
        await newCart.save();
        count = await Cart.countDocuments({ userId });
      }

      res.status(200).json({ status: true, count: count });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  removeFoodFromCart: async (req, res) => {
    const cartId = req.params.id;

    const userId = req.user.id;

    let count;

    try {
      const cartItem = await Cart.findById(cartId);

      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Cart Item not found!" });
      }

      await Cart.findByIdAndDelete({ _id: cartId });
      count = await Cart.countDocuments({ userId });

      res.status(200).json({ status: true, cartCount: count });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  fetchUserCart: async (req, res) => {
    const userId = req.user.id;
  
    try {
      const userCart = await Cart.find({ userId: userId }).populate({
        path: "foodId",
        select: "title imageUrl restaurant rating ratingCount",
      });
  
     const count = await Cart.countDocuments({userId: userId})
      res.status(200).json({ status: true, cart: userCart, cartCount: count});
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  clearUserCart: async (req, res) => {
    const userId = req.user.id;
    let count;

    try {
      await Cart.deleteMany({ userId: userId });
      count = await Cart.countDocuments({ userId: userId });
      res.status(200).json({
        status: true,
        count: count,
        message: "Cart Successfully Cleared!",
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  getCartCount: async (req, res) => {
    const userId = req.user.id;
    try {
      const count = await Cart.countDocuments({ userId: userId });
      res.status(200).json({ status: true, cartCount: count });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  decrementFoodQTy: async (req, res) => {
    const userId = req.user.id;
    const foodId = req.body.foodId;

    let count;
    try {
      const cartItem = await Cart.find({ userId: userId, foodId: foodId });
      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Cart Item Not Found!" });
      }

      const foodPrice = cartItem.totalPrice / quantity;
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.totalPrice -= foodPrice;

        await cartItem.save();
        res.status(200).json({
          status: true,
          message: "CartItem decremented Successfully!",
        });
      } else if (cartItem.quantity === 1) {
        await Cart.findByIdAndDelete({ userId: userId, foodId: foodId });
        count = await Cart.countDocuments({ userId });
        res.status(200).json({
          status: true,
          cartCount: count,
        });
      }
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
};
