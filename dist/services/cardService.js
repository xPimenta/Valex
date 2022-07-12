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
import { faker } from "@faker-js/faker";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { createAndVerifyUniqueCardNumber } from "../utils/createAndVerifyUniqueCardNumber.js";
import { getNowAddAndFormatDate } from "../utils/dateFunctions.js";
import { security } from "../utils/encryptionFunctions.js";
import { formatEmployeeName } from "../utils/formatEmployeeName.js";
export function createCard(employee, cardType) {
    return __awaiter(this, void 0, void 0, function () {
        var cardData, createdCard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createCardData(employee.id, employee.fullName, cardType)];
                case 1:
                    cardData = _a.sent();
                    return [4 /*yield*/, cardRepository.insert(cardData)];
                case 2:
                    createdCard = _a.sent();
                    if (createdCard.rowCount === 0) {
                        throw {
                            status: 400,
                            message: "Something went wrong"
                        };
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function createCardData(employeeId, employeeFullName, cardType, password, isVirtual, originalCardId) {
    if (password === void 0) { password = null; }
    if (isVirtual === void 0) { isVirtual = false; }
    if (originalCardId === void 0) { originalCardId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var cardNumber, cardholderName, securityCode, hashSecurityCode, expirationDate, isBlocked, cardData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createAndVerifyUniqueCardNumber()];
                case 1:
                    cardNumber = _a.sent();
                    cardholderName = formatEmployeeName(employeeFullName);
                    securityCode = faker.finance.creditCardCVV();
                    hashSecurityCode = security.encryptSecurityCode(securityCode);
                    expirationDate = getNowAddAndFormatDate(5, "years", "MM/YY");
                    isBlocked = false;
                    console.log("🚀 ~ securityCode", securityCode);
                    cardData = {
                        employeeId: employeeId,
                        number: cardNumber,
                        cardholderName: cardholderName,
                        securityCode: hashSecurityCode,
                        expirationDate: expirationDate,
                        password: password,
                        isVirtual: isVirtual,
                        originalCardId: originalCardId,
                        isBlocked: isBlocked,
                        type: cardType
                    };
                    return [2 /*return*/, cardData];
            }
        });
    });
}
export function updateCard(id, cardData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.update(id, cardData)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function gatherCardBalanceAndStatements(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var cardPayments, cardRecharges, cardBalance, cardBalanceAndStatements;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, paymentRepository.findByCardId(cardId)];
                case 1:
                    cardPayments = _a.sent();
                    return [4 /*yield*/, rechargeRepository.findByCardId(cardId)];
                case 2:
                    cardRecharges = _a.sent();
                    cardBalance = calculateCardBalance(cardPayments, cardRecharges);
                    cardBalanceAndStatements = {
                        balance: cardBalance,
                        transactions: cardPayments,
                        recharges: cardRecharges
                    };
                    return [2 /*return*/, cardBalanceAndStatements];
            }
        });
    });
}
export function calculateCardBalance(payments, recharges) {
    var totalRecharge = recharges.reduce(function (acc, current) {
        return acc + current.amount;
    }, 0);
    var totalSpent = payments.reduce(function (acc, current) {
        return acc + current.amount;
    }, 0);
    return totalRecharge - totalSpent;
}
