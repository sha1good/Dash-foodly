const router = require("express").Router();

const foodController = require("../controllers/foodController");

const { verifyVendor} = require("../middlewares/verifyToken");


router.post("/", verifyVendor, foodController.addFood);

router.post("/tags/:id", verifyVendor, foodController.addFoodTags);

router.post("/type/:id",verifyVendor,  foodController.addFoodType);

router.get("/:id", foodController.getFoodById);
router.get("/:category/:code", foodController.getRandomFoodByCategoryAndCode);



router.patch("/update/:id", verifyVendor, foodController.updateFoodById);
router.patch("/:id", verifyVendor, foodController.foodAvailability);


router.get("/restaurant/:restId", foodController.getFoodByResturant);

router.get("/recommendation/:code", foodController.getRandomFoodByCode);

router.delete("/:id", verifyVendor, foodController.deleteFoodById);

module.exports = router;