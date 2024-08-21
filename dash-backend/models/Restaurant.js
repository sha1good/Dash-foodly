const mongoose = require("mongoose");

const RestuarantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    foods: { type: Array },
    pickup: { type: Boolean, required: false, default: true },
    delivery: { type: Boolean, required: false, default: true },
    owner: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    code: { type: String, required: true },
    logoUrl: {
      type: String,
      required: true,
      default:
        "https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-spicy-crispy-buffalo-poutine:nutrition-calculator-tile",
    },
    rating: { type: Number, min: 1, max: 5 },
    ratingCount: { type: String },
    coords: {
      id: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
      title: { type: String, required: true },
      latitudeDelta: { type: Number, required: true, default: 0.0122 },
      longitudeDelta: { type: Number, required: true, default: 0.0221},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restuarants", RestuarantSchema);
