const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "user already registrerd..",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated", otp);

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp send successfully..",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup

exports.signUP = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword does not match try again..",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already  registered",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "otp not found..",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "invalid otp.. ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // entry in db

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot be registered, please try again..",
    });
  }
};

// login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, pls try again..",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetai");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not registered, pls signup first..",
      });
    }
    // pass matching 
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      // jwt token 
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      //cookie 
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "loggrd in sucessfully..",
      });
    } else {
      return res.status(401).json({
        success: false,
        message:'password is incorrect..  '
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "faield to loged in something went wrong..",
    });
  }
};

// change password  

exports.changePassword = async(req,res)=>{
  const  {email,password} =req.body; 
  
}