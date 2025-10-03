const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

const mongourl = process.env.MONGO_URL;

mongoose
  .connect(mongourl, {})
  .then(() => {
     console.log("Connected successfully to MongoDB");
  })
  .catch((error) => {
     console.log("Error connecting to MongoDB", error);
  });
