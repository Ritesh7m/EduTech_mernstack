const User = require("../models/User");
const mailSender = require("../utils/mailSender");

// reset password token

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status({
        success: false,
        message: "your email is not registerd with us..",
      });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "password rest link",
      `password reset link : ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "email sent succesfully for reset password ",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "something went wrong while reseting the password..",
    });
  }
};

exports.resetPassword = async (req, res) => {
  // data fetch
  // validation
  // get user data from db using token
  // if no entry  ---- invlid token or expire
  // hash pass
  // update pass
  //  return response
  try {
    const { password, confirmPasword, token } = req.body;

    if (password !== confirmPasword) {
      return res.status(401).json({
        success: false,
        message: "password and confirm password are not same..",
      });
    }

    const userDetails = await User.finfdOne({
      token: token,
    });

    if (!userDetails) {
      return res.json({
        success: false,
        message: "token is invalid..",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token is expired..",
      });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      sucess: true,
      message: "password uodated successfully..",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while reseting the password..",
    });
  }
};
