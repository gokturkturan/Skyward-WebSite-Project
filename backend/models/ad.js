import mongoose from "mongoose";

const adSchema = mongoose.Schema(
  {
    photos: [{}], //+
    price: { type: Number, maxLength: 255, required: true }, //+
    address: { type: String, maxLength: 255, required: true }, //+
    propertyType: { type: String, required: true }, //+
    title: { type: String, maxLength: 255, required: true }, //+
    action: { type: String, required: true }, //+
    description: {}, //+
    landSize: {
      type: Number,
      required: true,
    },
    bedroom: {
      type: Number,
      required: function () {
        return this.propertyType === "house";
      },
      validate: {
        validator: function () {
          return this.propertyType === "house";
        },
        message:
          "The bedrooms value can only be set if the property type is house.",
      },
    },
    bathroom: {
      type: Number,
      required: function () {
        return this.propertyType === "house";
      },
      validate: {
        validator: function () {
          return this.propertyType === "house";
        },
        message:
          "The bathrooms value can only be set if the property type is house.",
      },
    },
    carPark: {
      type: String,
      required: function () {
        return this.propertyType === "house";
      },
      validate: {
        validator: function () {
          return this.propertyType === "house";
        },
        message:
          "The carPark value can only be set if the property type is house.",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [27.142826, 38.423733] },
    },
    slug: { type: String, lowercase: true, unique: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isSold: { type: Boolean, default: false },
    googleMap: {},
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Ad = mongoose.model("Ad", adSchema);
export default Ad;
