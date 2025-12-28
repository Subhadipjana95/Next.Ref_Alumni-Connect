const express = require('express');
const router = express.Router();
const { analyzeProfile } = require('../controllers/ProfileAnalysisController');
const { auth } = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Analyze student profile against target role
router.post('/analyze', analyzeProfile);

module.exports = router;
