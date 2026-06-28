import bcrypt from "bcrypt";
import validator from "validator";

import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, maxlength: 25, unique: true },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please enter an email"],
      unique: true,
      validate: [
        (val) => {
          return validator.isEmail(val);
        },
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (params) {
  return await bcrypt.compare(params, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
