const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');

exports.capturePayment = async (req, res) => {
    try{
        const {course_id} = req.body;
        const userId = req.user.id;

        if(!course_id){
            return res.status(400).json({
                success: false,
                message: 'Please provide valid course Id..',
            })
        }

        let course = await Course.findById(course_id);
        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found..',
            })
        }
        

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

