import { security } from "../utils/encryptionFunctions.js";
export function validateCardPassword(req, res, next) {
    console.log("validateCardPassword");
    var card = res.locals.card;
    var password = req.body.password;
    var decryptedPassword = security.decryptPassword(password, card.password);
    if (!decryptedPassword)
        throw { status: 401, message: "Wrong password" };
    next();
}
