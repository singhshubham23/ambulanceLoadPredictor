const mongoose = require("mongoose");

const ambulanceLogSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    zone: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    arrivalTime: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);


ambulanceLogSchema.index({ city: 1, arrivalTime: -1 });
ambulanceLogSchema.index({ city: 1, zone: 1 });

module.exports = mongoose.model("AmbulanceLog", ambulanceLogSchema);
