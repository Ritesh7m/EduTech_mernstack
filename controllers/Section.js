const Section = require("../models/Section");
const Course = require("../models/Course");
  
// create section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // HW use populate to replace section /sub-section both in the updatedCourseDetails

    return res.status(200).json({
      success: true,
      message: "section created successfully..",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while creating section..",
    });
  }
};
 // update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "section updated successfully..",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while updating section..",
    });
  }
};
 // delete section 
exports.deleteSection = async(req,res)=>{
    try{
        const{sectionId} = req.params;
         await Section.findByIdAndDelete(sectionId);
        //  TODO: do we need to delete the entry from the course schema ??
         return res.status(200).json({
            success: true,
            message: "section deleted successfully..",
         });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting section..",
        });
    }
}
