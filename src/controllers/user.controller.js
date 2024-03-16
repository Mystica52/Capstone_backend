import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import User from "../models/user.js";
import { upload } from "../utils/upload.js";

dotenv.config();
const handleImageUpload = upload.single("profileImage");

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
    }
    const hashedPassword = await bcrpyt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "passenger",
    });
    await newUser.save();
    res.status(201).json({
      message: "User created Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error creating user", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        Error: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrpyt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.name,
        role: user.role,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error While getting All users", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
export const editProfile = async (req, res) => {
  try {
    // Handle image upload
    handleImageUpload(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          // Multer error occurred
          console.error("Multer error:", err);
          return res.status(500).json({
            success: false,
            error: "Error uploading image",
          });
        } else if (err) {
          // Other errors occurred
          console.error("Error uploading image:", err);
          return res.status(500).json({
            success: false,
            error: "Error uploading image",
          });
        }

        const { name, email, contactNumber, city } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        // Update user profile fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.contactNumber = contactNumber || user.contactNumber;
        user.city = city || user.city;

        // Check if an image file was uploaded
        if (req.file) {
          user.profileImage = req.file.path;
        } else {
          // If no image uploaded, set a default profile image
          user.profileImage = "default_profile.jpg"; // Adjust this to your default profile image path
        }

        await user.save();

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user,
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not exist",
      });
    }
    const isPasswordValid = await bcrpyt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }
    const hashedNewPassword = await bcrpyt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error While Changing password", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
