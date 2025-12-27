/**
 * Uploads PDF to MongoDB
 * @param {Object} resumeFile - req.files.resume
 * @returns {Object} PDF data ready for MongoDB storage
 */
exports.uploadPdfToMongoDB = async (resumeFile) => {
  const fs = require("fs");
  
  try {
    // Validate file
    if (!resumeFile) {
      throw new Error("Resume file is required");
    }

    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are allowed");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (resumeFile.size > maxSize) {
      throw new Error("File size should not exceed 2MB");
    }

    // Read file as buffer
    const fileData = fs.readFileSync(resumeFile.tempFilePath);

    // Clean up temp file
    fs.unlinkSync(resumeFile.tempFilePath);

    // Return data ready for MongoDB
    return {
      data: fileData,
      contentType: resumeFile.mimetype,
      fileName: resumeFile.name,
      fileSize: resumeFile.size,
      uploadedAt: new Date(),
    };

  } catch (error) {
    // Clean up temp file on error
    if (resumeFile.tempFilePath && fs.existsSync(resumeFile.tempFilePath)) {
      fs.unlinkSync(resumeFile.tempFilePath);
    }
    throw error;
  }
};
