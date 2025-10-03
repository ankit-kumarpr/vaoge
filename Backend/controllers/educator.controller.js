const Leave=require("../models/leave.model");
const Educator=require("../models/educator.model");

const ApplyLeave=async(req,res)=>{
    const {educatorId}=req.body;
    const {Subject,startdate, enddate ,description,}=req.body;
    try{
        if(!educatorId){
            return res.status(400).json({
                error:true,
                message:"Something went wrong || Educator ID is missing"
            })
        }

        const educator=await Educator.findById({educatorId});
        if(!educator){
            return res.status(404).json({
                error:true,
                messagge:"Educator not found"
            })
        }

        const newleave=new Leave({
            Subject,
            startdate,
            enddate,
            description
        })
        newleave.educatorId=newleave._id;

        await newleave.save();
        return res.status(201).json({
            error:false,
            message:"Leave applied successfully",
            data:newleave
        })

    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}


// update leavestate

const UpdateLeaveStatus=async(req,res)=>{
    const {leaveId}=req.params;
    const {status}=req.body;
    try{
        if(!leaveId){
            return res.status(400).json({
                error:true,
                message:"Something went wrong || Leave Id is missing"
            })
        }

        const leavedata=await Leave.findById({leaveId});
        if(!leavedata){
            return res.status(404).json({
                error:true,
                message:"Leave not found"
            })
        }
        data={
            status
        }

        const updateleave=await Leave.findByIdAndUpdate(leaveId,data,{new:true});
        return res.status(200).json({
            error:false,
            message:"Leave status updated successfully",
            data:updateleave
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}


// Get all leave

const Getleave=async(req,res)=>{
    try{
        const leave=await Leave.find();
        return res.status(200).json({
            error:false,
            message:"All leave fetched successfully",
            data:leave
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}

module.exports={
    ApplyLeave,
    UpdateLeaveStatus,
    Getleave
}