import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    about: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    homeAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    photo: {},
    role: {
      type: String,
      default: "Buyer",
      enum: ["Buyer", "Seller", "Admin"],
    },
    searchedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    resetCode: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
