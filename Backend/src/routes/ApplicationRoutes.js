const express = require("express");
const router = express.Router();

// Import controllers
const {
    viewApplications,
    viewStudentProfile,
    shortlistStudent,
    markAsReferred,
    rejectApplication,
    applyForReferral,
    getMyApplications,
    getApplicationDetails,
} = require("../controllers/ApplicationController");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Application Review routes (Alumni)
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// View Applications for an Opportunity (Alumni only - owner)
router.get("/applications/:opportunityId", viewApplications);

// View Student Profile (Alumni - same college)
router.get("/applications/student/:studentId", viewStudentProfile);

// Shortlist Student (Alumni only - owner)
router.post("/applications/:applicationId/shortlist", shortlistStudent);

// Mark as Referred (Alumni only - owner)
router.post("/applications/:applicationId/refer", markAsReferred);

// Reject Application (Alumni only - owner)
router.post("/applications/:applicationId/reject", rejectApplication);

// ********************************************************************************************************
//                                      Student Referral Application routes
// ********************************************************************************************************

// 5.1 Apply for Referral (Student only)
router.post("/apply", applyForReferral);

// 5.2 Application Status List - Get all my applications (Student only)
router.get("/my-applications", getMyApplications);

// 5.3 Application Details (Student only)
router.get("/my-applications/:applicationId", getApplicationDetails);

module.exports = router;
