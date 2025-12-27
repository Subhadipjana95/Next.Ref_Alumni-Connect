const express = require("express");
const router = express.Router();

// Import controllers
const {
    uploadResume,
    updateResume,
    getResume,
    deleteResume,
} = require("../controllers/StudentResume");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Student Resume routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Upload Resume (first time)
router.post("/resume/upload", uploadResume);

// Replace/Update Resume
router.put("/resume/update", updateResume);

// Get Resume Details
router.get("/resume", getResume);

// Delete Resume
router.delete("/resume", deleteResume);

module.exports = router;
