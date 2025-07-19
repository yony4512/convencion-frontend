const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ejemplo: "Chicken System Miraflores"
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  phone: { type: String },
  hours: { type: String }, // Ejemplo: "Lun-Dom: 12:00 - 22:00"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

locationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Location', locationSchema);