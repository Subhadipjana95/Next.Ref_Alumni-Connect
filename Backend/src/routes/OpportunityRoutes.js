const express = require("express");
const router = express.Router();

// Import controllers
const {
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunities,
    getMyOpportunities,
} = require("../controllers/OpportunityController");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Opportunity routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Post Referral Opportunity (Alumni only)
router.post("/opportunities/create", createOpportunity);

// Update Referral Opportunity (Alumni only - owner)
router.put("/opportunities/:opportunityId", updateOpportunity);

// Close Referral Opportunity (Alumni only - owner)
router.delete("/opportunities/:opportunityId", deleteOpportunity);

// View All Opportunities (Students & Alumni - same college)
router.get("/opportunities", getOpportunities);

// View My Posted Opportunities (Alumni only)
router.get("/my-opportunities", getMyOpportunities);

module.exports = router;
