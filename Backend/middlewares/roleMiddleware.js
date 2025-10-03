// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const roleMiddleware = (role) => {
//   return (req, res, next) => {
//     const token = req.header("Authorization");
//     console.log("Token Received:", token);

//     // If no token is provided
//     if (!token) {
//       return res.status(401).json({ error: true, message: "Access Denied. No Token Provided." });
//     }

//     // Check if token format is correct (Authorization: Bearer <token>)
//     if (!token.startsWith('Bearer ')) {
//       return res.status(400).json({ error: true, message: "Token format is incorrect. Use 'Bearer <token>'" });
//     }

//     // Remove "Bearer " from the token string
//     const tokenWithoutBearer = token.split(' ')[1];

//     try {
//       // Verify the JWT
//       const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
//       console.log("Decoded Token:", decoded); // Check if `role` exists here in the decoded token

//       req.user = decoded;

//       // Check if the role matches
//       if (role && req.user.role !== role) {
//         console.log("Role mismatch: Expected", role, "but got", req.user.role);
//         return res.status(403).json({ error: true, message: "Forbidden. Unauthorized role." });
//       }

//       next(); // Proceed to the next middleware or route handler

//     } catch (error) {
//       // Log detailed error message for debugging
//       console.error("Token Error:", error);
//       return res.status(400).json({ error: true, message: "Invalid Token" });
//     }
//   };
// };

// module.exports = roleMiddleware;

const jwt = require("jsonwebtoken");
require("dotenv").config();

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization");
    // console.log("Token Received:", token);

    // If no token is provided
    if (!token) {
      return res.status(401).json({ error: true, message: "Access Denied. No Token Provided." });
    }

    // Check if token format is correct (Authorization: Bearer <token>)
    if (!token.startsWith("Bearer ")) {
      return res.status(400).json({ error: true, message: "Token format is incorrect. Use 'Bearer <token>'" });
    }

    // Extract token from "Bearer <token>" format
    const tokenWithoutBearer = token.split(" ")[1];

    try {
      // Verify the JWT
      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
      // console.log("Decoded Token:", decoded); // Ensure `role` exists in the token payload

      req.user = decoded;

      // Ensure `roles` is an array, then check if user's role is included
      if (!roles.includes(req.user.role)) {
        // console.log("Role mismatch: Expected one of", roles, "but got", req.user.role);
        return res.status(403).json({ error: true, message: "Forbidden. Unauthorized role." });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token Error:", error);
      return res.status(400).json({ error: true, message: "Invalid Token" });
    }
  };
};

module.exports = roleMiddleware;
