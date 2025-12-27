const express = require("express");
const router = express.Router();

// Import controllers
const { signup, login, getStudentData } = require("../controllers/StudentAuth");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

module.exports = router;
