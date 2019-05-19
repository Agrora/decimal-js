"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const divide_1 = __importDefault(require("./divide"));
const isZero_1 = __importDefault(require("./isZero"));
const max_1 = __importDefault(require("./max"));
const multiply_1 = __importDefault(require("./multiply"));
const subtract_1 = __importDefault(require("./subtract"));
// bcmath equivalent: bc_divmod
/**
 * Division *and* modulo for numbers.  This computes both NUM1 / NUM2 and
 * NUM1 % NUM2  and puts the results in QUOT and REM, except that if QUOT
 * is NULL then that store will be omitted.
 */
function divideModulo(num1, num2, scale = Math.max(num1.scale, num2.scale)) {
    if (isZero_1.default(num2)) {
        throw Error('Division by zero');
    }
    /* Calculate final scale. */
    const resultScale = Math.max(num1.scale, num2.scale + scale);
    /* Calculate it. */
    const quotient = divide_1.default(num1, num2, 0);
    const temp = multiply_1.default(quotient, num2, resultScale);
    const remainder = subtract_1.default(num1, temp, resultScale);
    return [quotient, max_1.default(remainder, common_1.INFO_ZERO)];
}
exports.default = divideModulo;
