const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
        required: true,
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Referred", "Rejected"],
        default: "Applied",
    },
    // Snapshot of student's resume at the time of application
    resumeSnapshot: {
        url: {
            type: String,
        },
        public_id: {
            type: String,
        },
        uploadedAt: {
            type: Date,
        },
    },
    // Snapshot of key student profile info at application time
    profileSnapshot: {
        firstName: String,
        lastName: String,
        email: String,
        branch: String,
        graduationYear: Number,
        skills: [String],
        profileCompleteness: Number,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    shortlistedAt: {
        type: Date,
    },
    referredAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ["Applied", "Shortlisted", "Referred", "Rejected"],
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
    }],
}, { timestamps: true });

// Compound index to prevent duplicate applications
ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
