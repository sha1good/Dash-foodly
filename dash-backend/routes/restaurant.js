



const router = require("express").Router();

const restaurantController = require("../controllers/restuarantController");

const { verifyAndAuthorization, verifyVendor} = require("../middlewares/verifyToken");

router.get("/byId/:id", restaurantController.getRestaurant);
router.post("/", verifyAndAuthorization, restaurantController.addRestuarant);
router.get("/:code", restaurantController.getRandomRestaurant);
router.delete("/:id", verifyVendor, restaurantController.deleteRestaurant);
router.patch("/:id", verifyVendor,  restaurantController.serviceAvailability);

module.exports = router;