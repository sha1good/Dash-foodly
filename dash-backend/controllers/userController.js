const User = require("../models/User");

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await User.findById(
        { _id: userId },
        { password: 0, updatedAt: 0, createdAt: 0, __v: 0 }
      );

      res.status(200).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error retreiving the user!", error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;
    try {
      await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ status: true, message: "User Deleted Successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting  the user!" });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.user.id;

    try {
    await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        { new: true }
      );
      res
        .status(200)
        .json({ status: true, message: "User Updated Successfully!" });     
    } catch (err) {
        res.status(500).json({ message: "Error deleting  the user!" });  
    }
  },
};
