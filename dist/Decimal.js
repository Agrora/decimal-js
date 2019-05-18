"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("./add"));
const common_1 = require("./common");
const compare_1 = __importDefault(require("./compare"));
const divide_1 = __importDefault(require("./divide"));
const isZero_1 = __importDefault(require("./isZero"));
const multiply_1 = __importDefault(require("./multiply"));
const subtract_1 = __importDefault(require("./subtract"));
class Decimal {
    constructor(length, scale, value, sign) {
        this.length = length;
        this.scale = scale;
        this.value = value;
        this.sign = sign;
    }
    add(value, scale) {
        return Decimal.fromInfo(add_1.default(this, Decimal.from(value), scale));
    }
    subtract(value, scale) {
        return Decimal.fromInfo(subtract_1.default(this, Decimal.from(value), scale));
    }
    multiply(value, scale) {
        return Decimal.fromInfo(multiply_1.default(this, Decimal.from(value), scale));
    }
    divide(value, scale) {
        return Decimal.fromInfo(divide_1.default(this, Decimal.from(value), scale));
    }
    compareTo(value) {
        return compare_1.default(this, Decimal.from(value));
    }
    isEqualTo(value) {
        return this.compareTo(value) === 0;
    }
    isGreaterThan(value) {
        return this.compareTo(value) === 1;
    }
    isGreaterThanOrEqualTo(value) {
        return this.compareTo(value) >= 0;
    }
    isLowerThan(value) {
        return this.compareTo(value) === -1;
    }
    isLowerThanOrEqualTo(value) {
        return this.compareTo(value) <= 0;
    }
    isZero() {
        return isZero_1.default(this);
    }
    isOne() {
        return this.isEqualTo(Decimal.ONE);
    }
    isMinusOne() {
        return this.isEqualTo(Decimal.MINUS_ONE);
    }
    negate() {
        return Decimal.fromInfo(common_1.negate(this));
    }
    isNegative() {
        return this.sign === common_1.DecimalSign.MINUS;
    }
    isPositive() {
        return this.sign === common_1.DecimalSign.PLUS;
    }
    toString() {
        return common_1.createStringFromInfo(this);
    }
    toInt() {
        return parseInt(this.toString(), common_1.DECIMAL_RADIX);
    }
    toFloat() {
        return parseFloat(this.toString());
    }
    toFixed(scale) {
        return common_1.createStringFromInfo(this, scale);
    }
    static fromString(decimalString) {
        return Decimal.fromInfo(common_1.createInfoFromString(decimalString));
    }
    static fromInfo(info) {
        return new Decimal(info.length, info.scale, info.value, info.sign);
    }
    static fromNumber(decimalNumber) {
        return Decimal.fromInfo(common_1.createInfoFromString(decimalNumber.toString(common_1.DECIMAL_RADIX)));
    }
    static from(value) {
        if (value instanceof Decimal) {
            return value;
        }
        if (typeof value === 'string') {
            return Decimal.fromString(value);
        }
        if (typeof value === 'number') {
            return Decimal.fromNumber(value);
        }
        if (common_1.isInfo(value)) {
            return Decimal.fromInfo(value);
        }
        throw new Error(`Don't know how to parse value of type ${typeof value} to decimal`);
    }
}
Decimal.ZERO = Decimal.fromInfo(common_1.createInfo());
Decimal.ONE = Decimal.fromInfo(common_1.createInfoFromArray([1]));
Decimal.MINUS_ONE = Decimal.fromInfo(common_1.negate(common_1.createInfoFromArray([1])));
exports.default = Decimal;
