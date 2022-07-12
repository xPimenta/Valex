import Cryptr from "cryptr";
import bcrypt from "bcrypt";
var cryptr = new Cryptr(process.env.CRYPTR_KEY);
function encryptSecurityCode(password) {
    return cryptr.encrypt(password);
}
function encryptPassword(password) {
    var saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}
function decryptSecurityCode(encryptedSecurityCode) {
    return cryptr.decrypt(encryptedSecurityCode);
}
function decryptPassword(password, encryptedPassword) {
    var comparedPassword = bcrypt.compareSync(password, encryptedPassword);
    return comparedPassword;
}
export var security = {
    encryptSecurityCode: encryptSecurityCode,
    encryptPassword: encryptPassword,
    decryptSecurityCode: decryptSecurityCode,
    decryptPassword: decryptPassword
};
