const Profile = require("../models/Profile");
const User = require("../models/User");

// upadete a user profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", gender, contactNumber } = req.body;
    const id = req.user.id;
    if (!gender || !contactNumber || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.. ",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDeatils = await Profile.findById(profileId);

    profileDeatils.dateOfBirth = dateOfBirth;
    profileDeatils.about = about;
    profileDeatils.gender = gender;
    profileDeatils.contactNumber = contactNumber;
    await profileDeatils.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully..",
      profileDeatils,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "sommething wents wrong while upadting profile..",
    });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "user not found..",
      });
    }

    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
  // hw delete user from enrolled courses..
    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted succesfully..",
      userDetails,
    });
  } catch (error) {
    4;
    return res.status(500).json({
      sucess: false,
      message: "Account is not find which u want to delete..",
    });
  }
};

// get user profile

exports.getAllUserDetails = async (req, res) => {

  try{
    const id = req.user.id;
    const userDetails = await User.findById(id).populate('additionalDetails').exec();

    return res.status(200).json({
      success:true,
      message:"user details found successfully..",
      userDetails,
    })

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"user details not found..",
    })
  }

}