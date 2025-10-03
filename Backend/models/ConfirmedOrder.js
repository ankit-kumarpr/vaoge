const mongoose = require("mongoose");

const ConfirmedOrderSchema = new mongoose.Schema(
  {
    responseData: {
      type: Object, 
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConfirmedOrder", ConfirmedOrderSchema);
