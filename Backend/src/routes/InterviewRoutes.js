const express = require("express");
const router = express.Router();

// Import controllers
const { getSignedUrl } = require("../controllers/inteview");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Interview routes (ElevenLabs AI)
// ********************************************************************************************************

// Get signed URL for ElevenLabs conversation (requires authentication)
router.get("/interview/signed-url", auth, getSignedUrl);

// Public route alternative (if you want to allow without auth)
// router.get("/interview/signed-url", getSignedUrl);

module.exports = router;
