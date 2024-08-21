


const router = require("express").Router();

const categoryController = require("../controllers/categoryController");

const { verifyAdmin } = require("../middlewares/verifyToken");

router.put("/:id", verifyAdmin, categoryController.updateCategory);
router.post("/", verifyAdmin, categoryController.createCategory);
router.delete("/:id", verifyAdmin,categoryController.deleteCategory);
router.post("/image/:id", verifyAdmin, categoryController.patchCategoryImage);
router.get("/", categoryController.getAllCategory);
router.get("/random", categoryController.getRandomCategory);

module.exports = router;