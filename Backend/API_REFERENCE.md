# Backend API Routes - Quick Reference

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All routes require JWT authentication. Include token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📋 Opportunity Routes

### 1. Create Opportunity (Alumni Only)
**POST** `/opportunities/create`

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "roleDescription": "Build and maintain scalable web applications",
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "experienceLevel": "full-time",
  "numberOfReferrals": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Opportunity created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "jobTitle": "Senior Software Engineer",
    "roleDescription": "Build and maintain scalable web applications",
    "requiredSkills": ["React", "Node.js", "MongoDB"],
    "experienceLevel": "full-time",
    "numberOfReferrals": 5,
    "referralsGiven": 0,
    "postedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "company": "Tech Corp",
      "designation": "Senior Engineering Manager"
    },
    "college": "507f1f77bcf86cd799439013",
    "isActive": true,
    "createdAt": "2025-12-20T10:30:00.000Z",
    "updatedAt": "2025-12-20T10:30:00.000Z"
  }
}
```

---

### 2. Update Opportunity (Alumni Only - Owner)
**PUT** `/opportunities/:opportunityId`

**Request Body:**
```json
{
  "jobTitle": "Lead Software Engineer",
  "numberOfReferrals": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Opportunity updated successfully",
  "data": { ... }
}
```

---

### 3. Delete/Close Opportunity (Alumni Only - Owner)
**DELETE** `/opportunities/:opportunityId`

**Response:**
```json
{
  "success": true,
  "message": "Opportunity closed successfully"
}
```

---

### 4. Get All Opportunities (Students & Alumni - Same College)
**GET** `/opportunities`

**Response:**
```json
{
  "success": true,
  "message": "Opportunities retrieved successfully",
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "jobTitle": "Senior Software Engineer",
      "roleDescription": "Build and maintain scalable web applications",
      "requiredSkills": ["React", "Node.js", "MongoDB"],
      "experienceLevel": "full-time",
      "numberOfReferrals": 5,
      "referralsGiven": 2,
      "postedBy": {
        "firstName": "John",
        "lastName": "Doe",
        "company": "Tech Corp",
        "designation": "Senior Engineering Manager"
      },
      "isActive": true,
      "createdAt": "2025-12-20T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get My Posted Opportunities (Alumni Only)
**GET** `/my-opportunities`

**Response:**
```json
{
  "success": true,
  "message": "Your opportunities retrieved successfully",
  "count": 3,
  "data": [ ... ]
}
```

---

## 📝 Application Routes

### 1. Apply for Referral (Student Only)
**POST** `/apply`

**Request Body:**
```json
{
  "opportunityId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439014",
      "student": "507f1f77bcf86cd799439015",
      "opportunity": "507f1f77bcf86cd799439011",
      "status": "pending",
      "appliedAt": "2025-12-20T11:00:00.000Z"
    }
  }
}
```

---

### 2. Get My Applications (Student Only)
**GET** `/my-applications`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "student": "507f1f77bcf86cd799439015",
      "opportunity": {
        "_id": "507f1f77bcf86cd799439011",
        "jobTitle": "Senior Software Engineer",
        "roleDescription": "Build scalable systems",
        "experienceLevel": "full-time",
        "postedBy": {
          "firstName": "John",
          "lastName": "Doe",
          "company": "Tech Corp",
          "designation": "Manager"
        }
      },
      "status": "pending",
      "appliedAt": "2025-12-20T11:00:00.000Z",
      "updatedAt": "2025-12-20T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Application Details (Student Only)
**GET** `/my-applications/:applicationId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "opportunity": { ... },
    "status": "shortlisted",
    "appliedAt": "2025-12-20T11:00:00.000Z",
    "statusHistory": [
      {
        "status": "pending",
        "changedAt": "2025-12-20T11:00:00.000Z"
      },
      {
        "status": "shortlisted",
        "changedAt": "2025-12-20T12:00:00.000Z",
        "changedBy": "507f1f77bcf86cd799439012"
      }
    ]
  }
}
```

---

### 4. View Applications for Opportunity (Alumni Only - Owner)
**GET** `/applications/:opportunityId`

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "student": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "college": "MIT",
        "department": "Computer Science",
        "graduationYear": 2024,
        "skills": ["React", "Python", "Docker"],
        "resume": "https://cloudinary.com/resume.pdf"
      },
      "opportunity": {
        "_id": "507f1f77bcf86cd799439011",
        "jobTitle": "Senior Software Engineer",
        "roleDescription": "Build scalable systems",
        "experienceLevel": "full-time"
      },
      "status": "pending",
      "appliedAt": "2025-12-20T11:00:00.000Z",
      "updatedAt": "2025-12-20T11:00:00.000Z"
    }
  ]
}
```

---

### 5. View Student Profile (Alumni - Same College)
**GET** `/applications/student/:studentId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "college": "MIT",
    "department": "Computer Science",
    "graduationYear": 2024,
    "skills": ["React", "Python", "Docker"],
    "resume": "https://cloudinary.com/resume.pdf",
    "linkedIn": "https://linkedin.com/in/janesmith"
  }
}
```

---

### 6. Shortlist Student (Alumni Only - Owner)
**POST** `/applications/:applicationId/shortlist`

**Response:**
```json
{
  "success": true,
  "message": "Student shortlisted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "shortlisted",
    "updatedAt": "2025-12-20T12:00:00.000Z"
  }
}
```

---

### 7. Mark as Referred (Alumni Only - Owner)
**POST** `/applications/:applicationId/refer`

**Response:**
```json
{
  "success": true,
  "message": "Application marked as referred successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "referred",
    "updatedAt": "2025-12-20T13:00:00.000Z"
  }
}
```

---

### 8. Reject Application (Alumni Only - Owner)
**POST** `/applications/:applicationId/reject`

**Response:**
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "rejected",
    "updatedAt": "2025-12-20T14:00:00.000Z"
  }
}
```

---

## 🔐 Authentication Routes

### Alumni Login
**POST** `/alumni/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "accountType": "Alumni",
    "company": "Tech Corp",
    "designation": "Senior Engineering Manager",
    "college": "MIT"
  }
}
```

### Student Login
**POST** `/student/login`

**Request Body:**
```json
{
  "email": "jane.smith@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439015",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "accountType": "Student",
    "college": "MIT",
    "department": "Computer Science"
  }
}
```

---

## 📊 Application Status Flow

```
pending → shortlisted → referred
   ↓
rejected
```

## 🚫 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is invalid or missing"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Opportunity not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 🧪 Testing with cURL

### Create Opportunity
```bash
curl -X POST http://localhost:3000/api/v1/opportunities/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobTitle": "Senior Software Engineer",
    "roleDescription": "Build scalable systems",
    "requiredSkills": ["React", "Node.js"],
    "experienceLevel": "full-time",
    "numberOfReferrals": 5
  }'
```

### Get My Opportunities
```bash
curl -X GET http://localhost:3000/api/v1/my-opportunities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Applications
```bash
curl -X GET http://localhost:3000/api/v1/applications/OPPORTUNITY_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Shortlist Student
```bash
curl -X POST http://localhost:3000/api/v1/applications/APPLICATION_ID/shortlist \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes

1. **Authentication Required:** All routes require a valid JWT token
2. **College Restriction:** Alumni can only view applications from students of the same college
3. **Owner Restriction:** Only the opportunity creator can manage applications
4. **Status History:** All status changes are tracked in the database
5. **Referral Limit:** Cannot refer more students than `numberOfReferrals` specified

---

**Last Updated:** December 20, 2025
