import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAdmin = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userRole = decodeToken.role;
    if (userRole === "admin") {
      next();
    } else {
      return res.status(403).json({
        error: "Access denied.",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized invalidToken",
    });
  }
};
export const isAdminOrAgent = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userRole = decodeToken.role;
    if (userRole === "admin" || "agent") {
      next();
    } else {
      return res.status(403).json({
        error: "Access denied.",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized invalidToken",
    });
  }
};
