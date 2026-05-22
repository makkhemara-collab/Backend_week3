// server.js
import express from 'express';
import courses from './course.js';

const app = express();
const PORT = 3000;

//
// GLOBAL MIDDLEWARE
// Logs every incoming request
//
app.use((req, res, next) => {

    console.log('--------------------------');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log('Query Params:', req.query);

    next(); // continue to next middleware/route
});

//
// ROUTE-SPECIFIC MIDDLEWARE
// Validate query parameters
//
function validateCredits(req, res, next) {

    const { minCredits, maxCredits } = req.query;

    // Check if minCredits is an integer
    if (
        minCredits !== undefined &&
        isNaN(parseInt(minCredits))
    ) {
        return res.status(400).json({
            error: 'minCredits must be a valid integer'
        });
    }

    // Check if maxCredits is an integer
    if (
        maxCredits !== undefined &&
        isNaN(parseInt(maxCredits))
    ) {
        return res.status(400).json({
            error: 'maxCredits must be a valid integer'
        });
    }

    // Convert to numbers
    const min = Number(minCredits);
    const max = Number(maxCredits);

    // Check invalid range
    if (
        minCredits !== undefined &&
        maxCredits !== undefined &&
        min > max
    ) {
        return res.status(400).json({
            error: 'minCredits cannot be greater than maxCredits'
        });
    }

    next();
}

//
// ROUTE
//
app.get(
    '/departments/:dept/courses',
    validateCredits,
    (req, res) => {

        const { dept } = req.params;

        const {
            level,
            minCredits,
            maxCredits,
            semester,
            instructor
        } = req.query;

        let filteredCourses = courses.filter(course => {

            // Department filter
            if (course.department !== dept) {
                return false;
            }

            // Level filter
            if (level && course.level !== level) {
                return false;
            }

            // Minimum credits
            if (
                minCredits &&
                course.credits < Number(minCredits)
            ) {
                return false;
            }

            // Maximum credits
            if (
                maxCredits &&
                course.credits > Number(maxCredits)
            ) {
                return false;
            }

            // Semester filter
            if (
                semester &&
                course.semester !== semester
            ) {
                return false;
            }

            // Instructor partial match
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

        // No matching results
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
    }
);

//
// START SERVER
//
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});