import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    role: { type: [String], default: [], enum: ["Buyer", "Seller", "Admin"] },
    searchedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    resetCode: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
