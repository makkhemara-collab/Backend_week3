// server.js
import express from 'express';
import courses from './course.js';

const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {

    const { dept } = req.params;

    const {
        level,
        minCredits,
        maxCredits,
        semester,
        instructor
    } = req.query;

    // Edge Case:
    // Invalid credit range
    if (
        minCredits &&
        maxCredits &&
        Number(minCredits) > Number(maxCredits)
    ) {
        return res.status(400).json({
            error: 'minCredits cannot be greater than maxCredits'
        });
    }

    // Filter courses
    let filteredCourses = courses.filter(course => {

        // Match department
        if (course.department !== dept) {
            return false;
        }

        // Filter by level
        if (level && course.level !== level) {
            return false;
        }

        // Filter by minimum credits
        if (minCredits && course.credits < Number(minCredits)) {
            return false;
        }

        // Filter by maximum credits
        if (maxCredits && course.credits > Number(maxCredits)) {
            return false;
        }

        // Filter by semester
        if (semester && course.semester !== semester) {
            return false;
        }

        // Filter by instructor (partial match, case-insensitive)
        if (
            instructor &&
            !course.instructor
                .toLowerCase()
                .includes(instructor.toLowerCase())
        ) {
            return false;
        }

        return true;
    });

    // No matching courses
    if (filteredCourses.length === 0) {
        return res.status(404).json({
            message: 'No matching courses found',
            results: [],
            meta: {
                total: 0
            }
        });
    }

    // Success response
    res.json({
        results: filteredCourses,
        meta: {
            total: filteredCourses.length
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});