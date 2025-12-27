exports.calculateProfileCompleteness = (student) => {
    let score = 0;
    const fields = [
        { field: student.firstName, weight: 8 },
        { field: student.lastName, weight: 8 },
        { field: student.email, weight: 8 },
        { field: student.image, weight: 4 },
        { field: student.college, weight: 12 },
        { field: student.branch, weight: 10 },
        { field: student.graduationYear, weight: 10 },
        { field: student.skills && student.skills.length > 0, weight: 10 },
        { field: student.projects && student.projects.length > 0, weight: 10 },
        { field: student.certifications && student.certifications.length > 0, weight: 5 },
        { field: student.preferredRoles && student.preferredRoles.length > 0, weight: 5 },
        { field: student.resume && student.resume.data, weight: 5 },
        { field: student.linkedIn && student.linkedIn.data, weight: 5 },
    ];

    fields.forEach(({ field, weight }) => {
        if (field) score += weight;
    });

    return score;
}
