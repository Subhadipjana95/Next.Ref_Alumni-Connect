const express = require("express");
const router = express.Router();

// Import controllers
const {
    updateProfile,
    getProfile,
    getProfileStatus,
} = require("../controllers/StudentProfile");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Student Profile routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Create / Update Profile
router.put("/profile", updateProfile);

// Get Own Profile
router.get("/profile", getProfile);

// Get Profile Completion Status
router.get("/profile/status", getProfileStatus);

module.exports = router;
