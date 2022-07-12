var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dayjs from "dayjs";
import * as cardRepository from "../repositories/cardRepository.js";
import { addAndFormatDateExistingDate } from "../utils/dateFunctions.js";
import { security } from "../utils/encryptionFunctions.js";
function getAndPassToLocals(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var card, cardId, cardNumber, cardholderName, cardExpirationDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.body.cardId || req.query.cardId)) return [3 /*break*/, 2];
                    cardId = req.body.cardId || req.query.cardId;
                    if (req.body.cardId && req.query.cardId) {
                        throw {
                            status: 400,
                            message: "card identifier must be passed on request body OR query string, not both"
                        };
                    }
                    return [4 /*yield*/, cardRepository.findById(cardId)];
                case 1:
                    card = _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!req.body.cardNumber) return [3 /*break*/, 4];
                    cardNumber = req.body.cardNumber;
                    cardholderName = req.body.cardholderName;
                    cardExpirationDate = req.body.cardExpirationDate;
                    return [4 /*yield*/, cardRepository.findByCardDetails(cardNumber, cardholderName, cardExpirationDate)];
                case 3:
                    card = _a.sent();
                    _a.label = 4;
                case 4:
                    console.log("🚀 ~ card", card);
                    res.locals.card = card;
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureExistance(req, res, next) {
    var card = res.locals.card;
    if (!card) {
        throw { status: 404, message: "Card doesn't exist" };
    }
    next();
}
function ensureIsNotExpired(req, res, next) {
    console.log("ensureCardIsNotExpired");
    var card = res.locals.card;
    var expirationMonth = card.expirationDate.slice(0, 2);
    var expirationYear = card.expirationDate.slice(3, 5);
    var expirationFullDate = "".concat(expirationMonth, "/01/").concat(expirationYear);
    var expirationFormattedDate = addAndFormatDateExistingDate(1, "month", expirationFullDate);
    var cardIsExpired = dayjs().isAfter(expirationFormattedDate);
    if (cardIsExpired)
        throw { status: 400, message: "Expired card" };
    next();
}
function validateSecurityCode(req, res, next) {
    var card = res.locals.card;
    var securityCode = req.body.securityCode;
    var decryptedCode = security.decryptSecurityCode(card.securityCode);
    if (securityCode !== decryptedCode)
        throw { status: 401, message: "Wrong security code" };
    next();
}
function ensureIsNotActivated(req, res, next) {
    var card = res.locals.card;
    if (card.password)
        throw { status: 400, message: "Card already activated" };
    next();
}
function ensureIsActivated(req, res, next) {
    var card = res.locals.card;
    if (!card.password)
        throw { status: 400, message: "Card is not activated" };
    next();
}
function validatePassword(req, res, next) {
    console.log("validateCardPassword");
    var card = res.locals.card;
    var password = req.body.password;
    var decryptedPassword = security.decryptPassword(password, card.password);
    if (!decryptedPassword)
        throw { status: 401, message: "Wrong password" };
    next();
}
function ensureIsNotBlocked(req, res, next) {
    var card = res.locals.card;
    if (card.isBlocked)
        throw { status: 400, message: "The card is blocked" };
    next();
}
function ensureIsBlocked(req, res, next) {
    var card = res.locals.card;
    if (!card.isBlocked)
        throw { status: 400, message: "The card is unblocked" };
    next();
}
function ensureIsNotVirtual(req, res, next) {
    var card = res.locals.card;
    if (card.isVirtual)
        throw { status: 400, message: "This card is a virtual card" };
    next();
}
function ensureIsVirtual(req, res, next) {
    var card = res.locals.card;
    if (!card.isVirtual)
        throw { status: 400, message: "This card is not a virtual card" };
    next();
}
var card = {
    getAndPassToLocals: getAndPassToLocals,
    ensureExistance: ensureExistance,
    ensureIsNotExpired: ensureIsNotExpired,
    validateSecurityCode: validateSecurityCode,
    ensureIsNotActivated: ensureIsNotActivated,
    ensureIsActivated: ensureIsActivated,
    validatePassword: validatePassword,
    ensureIsNotBlocked: ensureIsNotBlocked,
    ensureIsBlocked: ensureIsBlocked,
    ensureIsNotVirtual: ensureIsNotVirtual,
    ensureIsVirtual: ensureIsVirtual
};
export { card };
