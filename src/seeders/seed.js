import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  tls: true,
});

const users = [
  {
    name: "admin User",
    email: "admin@example.com",
    password: "password123",
    contactNumber: "1234567890",
    city: "New York",
    role: "admin",
    profileImage: "profile1.jpg",
  },
  {
    name: "agent User",
    email: "agent@example.com",
    password: "password123",
    contactNumber: "1234567890",
    city: "New York",
    role: "agent",
    profileImage: "profile1.jpg",
  },
  {
    name: "passenger User",
    email: "passenger@example.com",
    password: "password123",
    contactNumber: "1234567890",
    city: "New York",
    role: "passenger",
    profileImage: "profile1.jpg",
  },
];

async function hashPasswords(users) {
  const saltRounds = 10;
  for (let user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  }
}
async function deleteExistingUsers() {
  try {
    await User.deleteMany({
      email: {
        $in: users.map((user) => user.email),
      },
    });
    console.log("Existing users deleted successfully");
  } catch (error) {
    console.error("Error deleting existing users:", error);
  }
}
async function seedUsers() {
  try {
    await deleteExistingUsers();
    await hashPasswords(users);
    await User.insertMany(users);
    console.log("User seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedUsers();
