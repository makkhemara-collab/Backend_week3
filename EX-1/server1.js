// server.js from EX2 last week

import express from 'express';

const app = express();
const PORT = 3000;

// GLOBAL MIDDLEWARE
// Logs every request
app.use((req, res, next) => {

    console.log('--------------------------');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);

    next();
});

// HOME ROUTE
app.get('/', (req, res) => {

    res.send(`
        <html>
            <head>
                <title>Home</title>
            </head>
            <body>
                <h1>Welcome to the Home Page</h1>
                <p>This is a simple Express.js server.</p>
            </body>
        </html>
    `);
});

// ABOUT ROUTE
app.get('/about', (req, res) => {

    res.send('About us: at CADT, we love Express.js!');
});

// CONTACT ROUTE
app.get('/contact-us', (req, res) => {

    res.send('You can reach us via email...');
});

// PRODUCTS ROUTE
app.get('/products', (req, res) => {

    res.send('Buy one get one...');
});

// PROJECTS ROUTE
app.get('/projects', (req, res) => {

    res.send('Here are our awesome projects');
});

// 404 HANDLER
app.use((req, res) => {

    res.status(404).send('404 Not Found');
});

// START SERVER
app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);
});