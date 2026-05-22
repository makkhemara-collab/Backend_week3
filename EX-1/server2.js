// server.js from EX3 last week

import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;

// MIDDLEWARE

// Parse form data automatically
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {

    console.log('--------------------------');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);

    next();
});

// HOME ROUTE
app.get('/', (req, res) => {

    res.send('Welcome to the Home Page');
});

// CONTACT FORM ROUTE
app.get('/contact', (req, res) => {

    res.send(`
        <form method="POST" action="/contact">
            <input 
                type="text" 
                name="name" 
                placeholder="Your name" 
            />
            
            <button type="submit">
                Submit
            </button>
        </form>
    `);
});

// HANDLE FORM SUBMISSION
app.post('/contact', (req, res) => {

    // Express automatically parses form data
    const { name } = req.body;

    console.log('Submitted Name:', name);

    // Save to file
    fs.appendFile(
        'submissions.txt',
        name + '\n',
        (err) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error saving submission');
            }

            // Success response
            res.send(`
                <h1>Submission Successful</h1>
                <p>Thank you, ${name}!</p>
            `);
        }
    );
});

// 404 HANDLER
app.use((req, res) => {

    res.status(404).send('404 Not Found');
});

// START SERVER
app.listen(PORT, () => {

    console.log(
        `Server is running at http://localhost:${PORT}`
    );
});