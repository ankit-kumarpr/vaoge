const Homework = require("../models/homework.model");
const Batch = require("../models/batch.model");
const Solution = require("../models/homeSolution.model");
const Student=require("../models/student.model");

// add homework
// const addHomework = async (req, res) => {
//   try {
//     const { homeworkname, homeworkdescription, batchId, educatorId } = req.body;
//     let homeworkfiles = req.files ? req.files.map((file) => file.path) : [];

//     if (!homeworkname || !homeworkdescription || !batchId || !educatorId) {
//       return res
//         .status(400)
//         .json({ error: true, message: "Missing required fields" });
//     }

//     const batch = await Batch.findById(batchId);
//     if (!batch) {
//       return res.status(404).json({ error: true, message: "Batch not found" });
//     }

//     const newHomework = new Homework({
//       batchId,
//       educatorId,
//       homeworkname,
//       homeworkdescription,
//       homeworkfiles,
//       status: "Pending",
//     });
//     newHomework.homeworkId=newHomework._id;
//     await newHomework.save();

//     return res.status(201).json({
//       error: false,
//       message: "Homework added successfully, awaiting admin approval",
//       data: newHomework,
//     });
//   } catch (error) {
//     console.error("Error adding homework:", error);
//     return res
//       .status(500)
//       .json({
//         error: true,
//         message: "Internal server error",
//         details: error.message,
//       });
//   }
// };

const addHomework = async (req, res) => {
  try {
    const {
      homeworkname,
      homeworkdescription,
      batchId,
      studentIds,
      educatorId,
    } = req.body;
    let homeworkfiles = req.files ? req.files.map((file) => file.path) : [];

    if (!homeworkname || !homeworkdescription || !educatorId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    // Check that at least batchId or studentIds is provided
    if (!batchId && (!studentIds || studentIds.length === 0)) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide batchId or studentIds" });
    }

    // Check if batch exists (if provided)
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res
          .status(404)
          .json({ error: true, message: "Batch not found" });
      }
    }

    // Check if students exist (if provided)
    let validStudentIds = [];
    if (studentIds && studentIds.length) {
      for (const studentId of studentIds) {
        const student = await Student.findById(studentId);
        if (!student) {
          return res
            .status(404)
            .json({ error: true, message: `Student not found: ${studentId}` });
        }
        validStudentIds.push(studentId);
      }
    }

    const newHomework = new Homework({
      batchId: batchId || null,
      studentIds: validStudentIds,
      educatorId,
      homeworkname,
      homeworkdescription,
      homeworkfiles,
      status: "Pending",
    });

    newHomework.homeworkId = newHomework._id;
    await newHomework.save();

    return res.status(201).json({
      error: false,
      message: "Homework added successfully, awaiting admin approval",
      data: newHomework,
    });
  } catch (error) {
    console.error("Error adding homework:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// Update home work status vverify home upload
const updateHomeworkStatus = async (req, res) => {
  try {
    const { homeworkId, status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: true, message: "Invalid status" });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res
        .status(404)
        .json({ error: true, message: "Homework not found" });
    }

    homework.status = status;
    await homework.save();

    return res.status(200).json({
      error: false,
      message: `Homework ${status.toLowerCase()} successfully`,
      data: homework,
    });
  } catch (error) {
    console.error("Error updating homework status:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// get home work approved
const getApprovedHomework = async (req, res) => {
  try {
    const { batchId } = req.params;

    const homeworkList = await Homework.find({ batchId, status: "Approved" });

    return res.status(200).json({
      error: false,
      message: "Approved homework fetched successfully",
      data: homeworkList,
    });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// Upload home solution by Student

const UploadSolution = async (req, res) => {
  try {
    const { homeworkId, studentId } = req.body;
    let solutionfiles = req.files ? req.files.map((file) => file.path) : [];

    if (!homeworkId || !studentId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework || homework.status !== "Approved") {
      return res
        .status(404)
        .json({ error: true, message: "Homework not found or not approved" });
    }

    const newSolution = new Solution({
      homeworkId,
      studentId,
      solutionfiles,
      status: "Pending",
    });
    newSolution.solutionId = newSolution._id;
    await newSolution.save();

    return res.status(201).json({
      error: false,
      message: "Solution submitted successfully, awaiting educator review",
      data: newSolution,
    });
  } catch (error) {
    console.error("Error uploading solution:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

//  Educator Approves or Rejects Solution
const reviewSolution = async (req, res) => {
  try {
    const { solutionId, status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: true, message: "Invalid status" });
    }

    const solution = await Solution.findById(solutionId);
    // console.log("solution is", solution);
    if (!solution) {
      return res
        .status(404)
        .json({ error: true, message: "Solution not found" });
    }

    solution.status = status;
    await solution.save();

    return res.status(200).json({
      error: false,
      message: `Solution ${status.toLowerCase()} successfully`,
      data: solution,
    });
  } catch (error) {
    console.error("Error reviewing solution:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// Get Approved Solutions for a Homework
const getApprovedSolutions = async (req, res) => {
  try {
    const { homeworkId } = req.params;

    const solutions = await Solution.find({ homeworkId, status: "Approved" });

    return res.status(200).json({
      error: false,
      message: "Approved solutions fetched successfully",
      data: solutions,
    });
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// get all homework

const GetallhomeworkRequest = async (req, res) => {
  try {
    const homeworks = await Homework.find();
    if (!homeworks || homeworks.length == 0) {
      return res.status(404).json({
        error: true,
        message: "Home work not found",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Home work list",
      data: homeworks,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get educator specific home work request

const GeteducatorhomeWork = async (req, res) => {
  const { educatorId } = req.params;
  try {
    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong",
      });
    }

    const homeworkdata = await Homework.find({ educatorId })
      .populate("batchId", "batchname")
      .populate("educatorId", "name email")
      .exec();

    return res.status(200).json({
      error: false,
      message: "Homework data for the educator fetched successfully",
      data: homeworkdata,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addHomework,
  updateHomeworkStatus,
  getApprovedHomework,
  UploadSolution,
  reviewSolution,
  getApprovedSolutions,
  GetallhomeworkRequest,
  GeteducatorhomeWork,
};
