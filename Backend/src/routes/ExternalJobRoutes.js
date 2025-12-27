const express = require("express");
const router = express.Router();

// Import controllers
const {
    getExternalJobs,
    searchExternalJobs
} = require("../controllers/ExternalJobController");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      External Job routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Get External Jobs
router.get("/jobs/external", getExternalJobs);

// Search External Jobs
router.get("/jobs/external/search", searchExternalJobs);

module.exports = router;
