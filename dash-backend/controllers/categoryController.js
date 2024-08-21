const Categories = require("../models/Categories");

module.exports = {
  createCategory: async (req, res) => {
    const category = new Categories(req.body);

    try {
      await category.save();
      res
        .status(200)
        .json({ status: true, message: "Category Created Successfully!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  updateCategory: async (req, res) => {
    const id = req.params.id;

    const { title, value, imageUrl } = req.body;

    try {
      const updatedCategory = await Categories.findByIdAndUpdate(
        id,
        { title: title, value: value, imageUrl: imageUrl },
        { new: true }
      );

      if (!updatedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category  Not found!" });
      }
      res
        .status(200)
        .json({ status: true, message: "Category Updated Successfully!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    const id = req.params.id;

    try {
      const deleteCategory = await Categories.findById(id);

      if (!deleteCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category  Not found!" });
      }

      await Categories.findByIdAndDelete(id);
      res
        .status(200)
        .json({ status: true, message: "Category deleted Successfully!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const categories = await Categories.find({}, { __v: 0 });

      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  patchCategoryImage: async (req, res) => {
    const id = req.params.id;

    const imageUrl = req.body;

    try {
      const existingCategory = await Categories.findById(id);

      const updatedCategory = new Category({
        title: existingCategory.title,
        value: existingCategory.value,
        imageUrl: imageUrl,
      });

      await updatedCategory.save();

      res.status(200).json({
        status: true,
        message: "Category Image Updated Successfully!",
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  getRandomCategory: async (req, res) => {
    try {
      let categories = await Categories.aggregate([
        { $match: { value: { $ne: "more" } } },
        { $sample: { size: 7 } },
      ]);

      const moreCategory = await Categories.findOne({ value: "more" });

      if (moreCategory) {
        categories.push(moreCategory);
      }
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
};
