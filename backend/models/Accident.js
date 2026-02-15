const mongoose = require("mongoose");

const accidentSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    zone: {
      type: String,
      required: true,
      trim: true
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital"
    },

    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);


accidentSchema.index({ location: "2dsphere" });
accidentSchema.index({ city: 1, date: -1 });
accidentSchema.index({ city: 1, zone: 1 });

module.exports = mongoose.model("Accident", accidentSchema);
