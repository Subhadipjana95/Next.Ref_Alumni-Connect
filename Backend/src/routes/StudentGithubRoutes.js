const express = require("express");
const router = express.Router();

// Import controllers
const {
    addGithubUrl,
    updateGithubUrl,
    getGithubUrl,
    deleteGithubUrl,
} = require("../controllers/StudentgithubUrl");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Student GitHub URL routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Add GitHub URL (first time)
router.post("/github", addGithubUrl);

// Update GitHub URL
router.put("/github", updateGithubUrl);

// Get GitHub URL
router.get("/github", getGithubUrl);

// Delete GitHub URL
router.delete("/github", deleteGithubUrl);

module.exports = router;
