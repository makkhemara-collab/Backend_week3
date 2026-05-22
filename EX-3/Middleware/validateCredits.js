export default function validateCredits(req, res, next) {

    const { minCredits, maxCredits } = req.query;

    if (
        minCredits &&
        maxCredits &&
        Number(minCredits) > Number(maxCredits)
    ) {
        return res.status(400).json({
            error: 'Invalid credit range'
        });
    }

    next();
}