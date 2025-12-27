const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    roleDescription: {
        type: String,
        required: true,
        trim: true,
    },
    requiredSkills: [{
        type: String,
        trim: true,
    }],
    experienceLevel: {
        type: String,
        required: true,
    },
    numberOfReferrals: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
        required: true,
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    status: {
        type: String,
        enum: ["Open", "Closed"],
        default: "Open",
    },
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", OpportunitySchema);
