# Alumni Connect Backend API

Backend API for the Alumni Connect application built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Signup/Login)
- JWT-based authorization
- Cloudinary integration for image uploads
- MongoDB database with Mongoose ODM
- Secure password hashing with bcrypt
- Input validation

#### Signup
```
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "accountType": "Student"
}

```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accountType": "Student",
    "image": "avatar_url"
  },
  "message": "student registered successfully"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accountType": "Student"
  },
  "message": "Student logged in successfully"
}
```



## 📁 Project Structure

```
Alumni-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js          ✅ Cloudinary setup
│   │   └── database.js            ✅ MongoDB connection
│   │
│   ├── controllers/
│   │   ├── StudentAuth.js         ✅ Student signup/login (FIXED)
│   │   ├── StudentProfile.js      ✅ Student profile management
│   │   ├── StudentResume.js       ✅ Resume upload/update
│   │   ├── AlumniAuth.js          ✅ Alumni signup/login
│   │   ├── AlumniProfile.js       ✅ Alumni profile management
│   │   ├── OpportunityController.js   ✅ Referral opportunities CRUD
│   │   └── ApplicationController.js   ✅ Application review & shortlisting
│   │
│   ├── middlewares/
│   │   └── auth.js                ✅ JWT authentication
│   │
│   ├── models/
│   │   ├── StudentModel.js        ✅ Student schema with all fields
│   │   ├── AlumniModel.js         ✅ Alumni schema with all fields
│   │   ├── CollegeModel.js        ✅ College schema (FIXED typo)
│   │   ├── OpportunityModel.js    ✅ Job opportunity schema
│   │   └── ApplicationModel.js    ✅ Application schema
│   │
│   ├── routes/
│   │   ├── StudentAuthRoutes.js   ✅ Student auth endpoints
│   │   ├── StudentProfileRoutes.js    ✅ Student profile endpoints
│   │   ├── StudentResumeRoutes.js     ✅ Resume endpoints
│   │   ├── AlumniAuthRoutes.js    ✅ Alumni auth endpoints
│   │   ├── AlumniProfileRoutes.js     ✅ Alumni profile endpoints
│   │   ├── OpportunityRoutes.js   ✅ Opportunity endpoints
│   │   └── ApplicationRoutes.js   ✅ Application endpoints
│   │
│   ├── utils/
│   │   ├── imageUploader.js       ✅ Cloudinary upload utility
│   │   └── tokenGenerator.js      ✅ JWT token generation
│   │
│   └── index.js                   ✅ Main server file
│
├── .env.example                   ✅ Environment template
├── .gitignore                     ✅ Git ignore rules
├── package.json                   ✅ Dependencies
├── README.md                      ✅ Documentation
└── POSTMAN_TESTING_GUIDE.md       ✅ API testing guide (NEW)
```

---

