"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("./add"));
exports.add = add_1.default;
const addUnsigned_1 = __importDefault(require("./addUnsigned"));
exports.addUnsigned = addUnsigned_1.default;
const common_1 = require("./common");
exports.copyInfo = common_1.copyInfo;
exports.createInfo = common_1.createInfo;
exports.createInfoFromArray = common_1.createInfoFromArray;
exports.createInfoFromString = common_1.createInfoFromString;
exports.createStringFromInfo = common_1.createStringFromInfo;
exports.createSubInfo = common_1.createSubInfo;
const compare_1 = __importDefault(require("./compare"));
exports.compare = compare_1.default;
const Decimal_1 = __importDefault(require("./Decimal"));
const divide_1 = __importDefault(require("./divide"));
exports.divide = divide_1.default;
const isZero_1 = __importDefault(require("./isZero"));
exports.isZero = isZero_1.default;
const multiply_1 = __importDefault(require("./multiply"));
exports.multiply = multiply_1.default;
const removeLeadingZeroes_1 = __importDefault(require("./removeLeadingZeroes"));
exports.removeLeadingZeroes = removeLeadingZeroes_1.default;
const subtract_1 = __importDefault(require("./subtract"));
exports.subtract = subtract_1.default;
const subtractUnsigned_1 = __importDefault(require("./subtractUnsigned"));
exports.subtractUnsigned = subtractUnsigned_1.default;
exports.default = Decimal_1.default;
function parseDecimal(value) {
    return Decimal_1.default.from(value);
}
exports.parseDecimal = parseDecimal;
function isDecimal(value) {
    return value instanceof Decimal_1.default;
}
exports.isDecimal = isDecimal;
function isDecimalLike(value) {
    return isDecimal(value) || ['string', 'number'].includes(typeof value) || common_1.isInfo(value);
}
exports.isDecimalLike = isDecimalLike;
