const router = require("express").Router();

const cartController = require("../controllers/cartController");

const { verifyAndAuthorization } = require("../middlewares/verifyToken");

router.post("/", verifyAndAuthorization, cartController.addFoodToCart);

router.post(
  "/decrement",
  verifyAndAuthorization,
  cartController.decrementFoodQTy
);

router.delete(
  "/delete/:id",
  verifyAndAuthorization,
  cartController.removeFoodFromCart
);

router.get("/", verifyAndAuthorization, cartController.fetchUserCart);

router.get("/count", verifyAndAuthorization, cartController.getCartCount);

router.delete("/clear", verifyAndAuthorization, cartController.clearUserCart);



module.exports = router;
