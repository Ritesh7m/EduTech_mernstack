const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token is missing..",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while validating the token..",
    });
  }
};

// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for student..",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user role cannot be verified , try again..",
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "this is protected route for  instructor..",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "user role cannot be verified , try again..",
      });
    }
  };

  exports.isAdmin = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "this is protected route for  Admin..",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "user role cannot be verified , try again..",
      });
    }
  };

