const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    adminId: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    otp: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model("Admin", AdminSchema);
