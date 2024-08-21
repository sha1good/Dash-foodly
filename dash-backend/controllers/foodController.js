const Food = require("../models/Food");
const mongoose = require("mongoose");

module.exports = {
  addFood: async (req, res) => {
    const newFood = new Food(req.body);

    try {
      await newFood.save();

      res
        .status(200)
        .json({ status: true, message: "Food created Successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Unable to Create the food Item!" });
    }
  },

  getFoodById: async (req, res) => {
    const foodId = req.params.id;
    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item Not Found!" });
      }

      res.status(200).json(food);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error retrieving the  Food Item!",
      });
    }
  },
  getFoodByResturant: async (req, res) => {
    console.log(req.params.restId);
    const { restId } = req.params;

    console.log("Hello");
    try {
      const foods = await Food.find({ restaurant: mongoose.Types.ObjectId(restId)});
      console.log(foods);

      if (!foods || foods.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No Food Item Found!" });
      }
      res.status(200).json(foods);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  },

  deleteFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food Not Found!" });
      }

      await Food.findByIdAndDelete(foodId);
      res.status(200).json({
        status: true,
        message: "Food Successfully Deleted!",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error Deleting Food!",
      });
    }
  },

  foodAvailability: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item Not Found!" });
      }

      food.isAvailable = !food.isAvailable;
      await food.save();

      res.status(200).json({
        status: true,
        message: "Food Availability Successfully toggled!",
        isAvailable: food.isAvailable,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  },

  updateFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedFood) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item Not found!" });
      }
      res
        .status(200)
        .json({ status: true, message: "Food Item Updated Successfully!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  addFoodTags: async (req, res) => {
    const foodId = req.params.id;

    const { tag } = req.body;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item Not Found!" });
      }

      if (food.foodTags.includes(tag)) {
        return res
          .status(404)
          .json({ status: false, message: " Tag Already Exist!" });
      }
      food.foodTags.push(tag);

      await food.save();

      res
        .status(200)
        .json({ status: true, message: "Food Tag Successfully Added!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  getRandomFoodByCode: async (req, res) => {
    try {
      let randomFoodItem = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { _id: 0 } },
      ]);

      res.status(200).json(randomFoodItem);
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  addFoodType: async (req, res) => {
    const foodId = req.params.id;
    const { foodType } = req.body;
    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item Not Found!" });
      }

      if (food.foodType.includes(foodType)) {
        return res
          .status(400)
          .json({ status: false, message: "FoodType Already Exist!" });
      }
      food.foodType.push(foodType);

      await food.save();

      res
        .status(200)
        .json({ status: true, message: "Food Type Successfully Added!" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  getRandomFoodByCategoryAndCode: async (req, res) => {
    const { category, code } = req.params;

    try {
      let foods = await Food.aggregate([
        { $match: { category: category, code: code } },
        { $sample: { size: 10 } },
      ]);

      if (!foods || foods.length === 0) {
        foods = await Food.aggregate([
          { $match: { code: code } },
          { $sample: { size: 10 } },
        ]);
      } else {
        foods = await Food.aggregate([{ $sample: { size: 10 } }]);
      }

      res.status(200).json(foods);
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
};
