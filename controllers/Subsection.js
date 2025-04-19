const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create sub-section
exports.createSubsection = async (req, res) => {
  try {
    const { sectionId, title, description, timeDuration } = req.body;

    const video = req.files.videoFile;

    if (!sectionId || !title || !description || !timeDuration || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subsectionDetails = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await SectionfindByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          subSection: subsectionDetails._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "sub-section created successfully..",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while creating sub-section..",
    });
  }
};

// update sub-section

exports.updatedSection = async (res, req) => {
  try {
    const { title, description, timeDuration, subSectionId } = req.body;
    if (!title || !description || !timeDuration || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const video = req.files.videoFile;
    let uploadDetails;
    if (video) {
      uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
    }
    const updatedSubsection = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        title: title,
        description: description,
        timeDuration: timeDuration,
        videoUrl: uploadDetails ? uploadDetails.secure_url : undefined,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "sub-section updated successfully..",
      updatedSubsection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while updating sub-section..",
    });
  }
};

// delete sub-section
 exports.deleteSubsection = async (req,res)=>{
    try{
        const{subSectionId} = req.params;
        await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success: true,
            message: "sub-section deleted successfully..",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting sub-section..",
        });

    }
 }
