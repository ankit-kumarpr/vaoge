require("./config/server.js");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const Adminrouter = require("./routes/admin.routes");
const commonrouter = require("./routes/common.routes");

const app = express();

// const corsOptions = {
//   origin: 'http://localhost:4500',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // Enable if you're using cookies/sessions
// };
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/courseimage", express.static("courseimage"));
app.use("/marksheets", express.static("marksheets"));

// Routes
app.use("/api/admin", Adminrouter);
app.use("/api/common", commonrouter);

const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log("Server running on port no= ", port);
});
