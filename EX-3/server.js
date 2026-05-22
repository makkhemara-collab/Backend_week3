import express from 'express';

import courses from './data/courses.js';

import logger from './Middleware/logger.js';

import validateCredits from './Middleware/validateCredits.js';

const app = express();

const PORT = 3000;

// GLOBAL MIDDLEWARE
app.use(logger);

// ROUTE
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

            if (course.department !== dept) {
                return false;
            }

            if (level && course.level !== level) {
                return false;
            }

            if (
                minCredits &&
                course.credits < Number(minCredits)
            ) {
                return false;
            }

            if (
                maxCredits &&
                course.credits > Number(maxCredits)
            ) {
                return false;
            }

            if (
                semester &&
                course.semester !== semester
            ) {
                return false;
            }

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

        if (filteredCourses.length === 0) {

            return res.status(404).json({
                message: 'No matching courses found',
                results: [],
                meta: {
                    total: 0
                }
            });
        }

        res.json({
            results: filteredCourses,
            meta: {
                total: filteredCourses.length
            }
        });
    }
);

// START SERVER
app.listen(PORT, () => {

    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});