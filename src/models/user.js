import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "passenger", "agent"],
    default: "passenger",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
