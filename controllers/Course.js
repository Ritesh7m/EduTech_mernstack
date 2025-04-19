const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tags } =
      req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const tagsDetails = await Tag.findById(tags);
    if (!tagsDetails) {
      return res.ststus(404).json({
        success: false,
        message: "tag not found..",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tags: tagsDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Tag.findByIdAndUpdate(
      { _id: tagsDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "course created successfully..",
      newCourse,
    });


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "something went wrong while creating course..",
    });
  }
};

// get all courses

exports.showAllCourses = async (req, res) => {
  try{
    const allCourses = await Course.find({},{courseName:true,price:true,
      thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true,
    }).populate('instructor').exec()

  }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while fetching all courses..",
    });
  }
}
