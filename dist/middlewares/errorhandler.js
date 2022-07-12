export function handleError(error, req, res, next) {
    console.log(error);
    if (error.status && error.message)
        return res.status(error.status).send(error.message);
    if (error.details)
        return res.status(422).send(error.details.map(function (_a) {
            var message = _a.message;
            return message;
        }));
    res.status(500);
}
