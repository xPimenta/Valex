import Cryptr from "cryptr";
import bcrypt from "bcrypt";
var cryptr = new Cryptr(process.env.CRYPTR_KEY);
export function encryptSecurityCode(password) {
    return cryptr.encrypt(password);
}
export function encryptPassword(password) {
    var saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}
export function decryptSecurityCode(encryptedSecurityCode) {
    return cryptr.decrypt(encryptedSecurityCode);
}
export function decryptPassword(password, encryptedPassword) {
    var comparedPassword = bcrypt.compareSync(password, encryptedPassword);
    return comparedPassword;
}
