const express = require("express");
const router = express.Router();

// Import controllers
const {
    updateProfile,
    getProfile,
} = require("../controllers/AlumniProfile");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Alumni Profile routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Create / Update Profile
router.put("/profile", updateProfile);

// Get Own Profile
router.get("/profile", getProfile);

module.exports = router;
