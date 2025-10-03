const NewStudent = require("../models/Newstudent");

// Add New Student
const AddnewStudent = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      fathername,
      mothername,
      qualification,
      email,
      phone,
      alternatephone,
      sameAddress,
      "currentAddress.addressline1": addressline1,
      "currentAddress.addressline2": addressline2,
      "currentAddress.city": city,
      "currentAddress.state": state,
      "currentAddress.country": country,
      "currentAddress.zip": zip,
      "currentAddress.landmark": landmark,
      "permanentAddress.addressline1": permanent_addressline1,
      "permanentAddress.addressline2": permanent_addressline2,
      "permanentAddress.city": permanent_city,
      "permanentAddress.state": permanent_state,
      "permanentAddress.country": permanent_country,
      "permanentAddress.zip": permanent_zip,
      "permanentAddress.landmark": permanent_landmark,
    } = req.body;

    // console.log("Request body:", req.body);

    // Validate required fields
    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields!",
      });
    }

    // Check if student already exists
    const existingStudent = await NewStudent.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        error: true,
        message: "Email already registered!",
      });
    }

    // Handle File Uploads
    const profile = req.files?.profile ? req.files.profile[0].path : null;
    const adharimage = req.files?.adharimage ? req.files.adharimage[0].path : null;

    // Prepare addresses
    const currentAddress = {
      addressline1,
      addressline2,
      city,
      state,
      country,
      zip,
      landmark,
    };

    const permanentAddress =
      sameAddress === "true"
        ? currentAddress
        : {
            addressline1: permanent_addressline1,
            addressline2: permanent_addressline2,
            city: permanent_city,
            state: permanent_state,
            country: permanent_country,
            zip: permanent_zip,
            landmark: permanent_landmark,
          };

    // Create new student instance
    const newStudent = new NewStudent({
      firstname,
      lastname,
      fathername,
      mothername,
      qualification,
      email,
      phone,
      phone2: alternatephone,
      currentAddress,
      permanentAddress,
      profile,
      adharimage,
      role: "newstudent",
    });

    // Save to database
    await newStudent.save();

    return res.status(201).json({
      error: false,
      message: "Student registered successfully!",
      data: [newStudent],
    });
  } catch (error) {
    console.error("Error in Registerstudent:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};



// get all new student

const GetallnewStudent=async(req,res)=>{
    try{

        const newstuList=await NewStudent.find();
        if(!newstuList || newstuList.length==0){
            return res.status(404).json({
                error:true,
                message:"No  New Student Register till"
            })
        }

        return res.status(201).json({
            error:true,
            message:"New Register student list..",
            data:[newstuList]
        })

    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}

module.exports = { AddnewStudent,GetallnewStudent };
