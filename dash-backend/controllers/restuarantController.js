const Restaurant = require("../models/Restaurant");


module.exports = {
  addRestuarant: async (req, res) => {
    const newRestuarant = new Restaurant(req.body);
    try {
      await newRestuarant.save();
      res
        .status(201)
        .json({ status: true, message: "Restuarant Successfully Created!" });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Error Creating Restuarant!" });
    }
  },

  serviceAvailability: async (req, res) => {
    const restuarantId = req.params.id;

    try {
      const restuarant = await Restaurant.findById(restuarantId);

      if (!restuarant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant Not Found!" });
      }

      restuarant.isAvailable = !restuarant.isAvailable;
      await restuarant.save();

      res.status(200).json({
        status: true,
        message: "Restaurant Availability Successfully toggled!",
        isAvailable: restuarant.isAvailable,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error toggling restaurant availability!",
      });
    }
  },

  deleteRestaurant: async (req, res) => {
    const restuarantId = req.params.id;

    try {
      const restuarant = await Restaurant.findById(restuarantId);
      if (!restuarant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant Not Found!" });
      }

      await Restaurant.findByIdAndDelete(restuarantId);
      res.status(200).json({
        status: true,
        message: "Restaurant Successfully Deleted!",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error Deleting Restuarant!",
      });
    }
  },

  getRestaurant: async (req, res) => {
    const restuarantId = req.params.id;
    try {
      const restuarant = await Restaurant.findById(restuarantId);
      if (!restuarant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant Not Found!" });
      }

      res.status(200).json(restuarant);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error retrieving the  Restuarant!",
      });
    }
  },

  getRandomRestaurant: async (req, res) => {
    try {
      let randomRestaurant = [];

      if (req.params.code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (!randomRestaurant.length) {
        randomRestaurant = await Restaurant.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (randomRestaurant.length) {
        res.status(200).json(randomRestaurant);
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error getting  the  Restuarant!",
      });
    }
  },
};
