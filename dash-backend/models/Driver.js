const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    vehicleType: {type: String, required: true, enum: ['Bike', 'Scooter', 'Car']},
    vehicleNumber: {type: String, required: true},
    currentLocation: {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        latitudeDelta: {type: Number, required: true, default: 0.0122},
        longitudeDelta: {type: Number, required: true, default: 0.0221},
    },
    isAvailable: {type: Boolean, required: true},
    rating: {type: Number, required: true},
    totalDeliveries: {type: Number, default: 0},
    profileImage: {type: String, defalut: "https://media.gettyimages.com/id/1255470283/photo/biker-in-motion-motogirl-motoboy.jpg?s=2048x2048&w=gi&k=20&c=J_NeFn6mcne3zHNdAf8fe-07o0qk5RlSVyB8_tpaMWw="}

},{timestamps: true})


module.exports = mongoose.model('Driver', driverSchema)