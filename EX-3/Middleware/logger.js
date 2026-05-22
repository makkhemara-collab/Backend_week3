export default function logger(req, res, next) {

    console.log('----------------');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);

    next();
}