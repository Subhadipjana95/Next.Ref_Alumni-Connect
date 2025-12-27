const express = require("express")
const {dbconnect} =require("./config/database")
const cloudinary = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");


// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://172.26.38.74:8080",
  "https://next-ref-alumni-connect.vercel.app"
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Setting up routes
const studentAuthRoutes = require("./routes/StudentAuthRoutes");
const profileRoutes = require("./routes/StudentProfileRoutes");
const resumeRoutes = require("./routes/StudentResumeRoutes");
const linkedInRoutes = require("./routes/StudentLinkedInRoutes");
const alumniAuthRoutes = require("./routes/AlumniAuthRoutes");
const alumniProfileRoutes = require("./routes/AlumniProfileRoutes");
const opportunityRoutes = require("./routes/OpportunityRoutes");
const applicationRoutes = require("./routes/ApplicationRoutes");
const externalJobRoutes = require("./routes/ExternalJobRoutes");

// Health check endpoint
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Alumni Connect API is running successfully!",
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use("/api/v1/student", studentAuthRoutes);
app.use("/api/v1/student", profileRoutes);
app.use("/api/v1/student", resumeRoutes);
app.use("/api/v1/student", linkedInRoutes);
app.use("/api/v1/alumni", alumniAuthRoutes);
app.use("/api/v1/alumni", alumniProfileRoutes);
app.use("/api/v1", opportunityRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1/student", externalJobRoutes);



const InitlizeConnection = async()=>{

    try{
        await dbconnect();
        console.log("✅ Connected to MongoDB");
        cloudinary.cloudinaryConnect();
        console.log("✅ Connected to Cloudinary");
        app.listen(PORT, ()=>{
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        })
    }
    catch(err){
        console.error("❌ Failed to initialize application");
        console.error("Error:", err.message);
        process.exit(1); // Exit if database connection fails
    }
}

InitlizeConnection();
