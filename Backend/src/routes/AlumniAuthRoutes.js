const express = require("express");
const router = express.Router();

// Import controllers
const { signup, login, getAlumniData } = require("../controllers/AlumniAuth");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Alumni Authentication routes
// ********************************************************************************************************

// Route for alumni signup
router.post("/signup", signup);

// Route for alumni login
router.post("/login", login);


module.exports = router;
