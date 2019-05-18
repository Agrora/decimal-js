"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const removeLeadingZeroes_1 = __importDefault(require("./removeLeadingZeroes"));
const { max } = Math;
// bcmath equivalent: _bc_do_add
function addUnsigned(a, b, minScale = 0) {
    const maxScale = max(a.scale, b.scale);
    const maxLength = max(a.length, b.length) + 1;
    const result = common_1.createInfo(maxLength, max(maxScale, minScale));
    // Start with the fraction part.  Initialize the pointers.
    let aLengthLeft = a.scale;
    let bLengthLeft = b.scale;
    let aPos = (a.length + aLengthLeft - 1);
    let bPos = (b.length + bLengthLeft - 1);
    let resultPos = (maxScale + maxLength - 1);
    // Add the fraction part.  First copy the longer fraction
    // (ie when adding 1.2345 to 1 we know .2345 is correct already) .
    if (aLengthLeft !== bLengthLeft) {
        if (aLengthLeft > bLengthLeft) {
            // n1 has more dp then n2
            for (; aLengthLeft > bLengthLeft; resultPos -= 1, aPos -= 1, aLengthLeft -= 1) {
                result.value[resultPos] = a.value[aPos];
            }
        }
        else {
            // n2 has more dp then n1
            for (; bLengthLeft > aLengthLeft; resultPos -= 1, bPos -= 1, bLengthLeft -= 1) {
                result.value[resultPos] = b.value[bPos];
            }
        }
    }
    // Now add the remaining fraction part and equal size integer parts.
    aLengthLeft += a.length;
    bLengthLeft += b.length;
    let carry = 0;
    let tmp;
    for (; aLengthLeft > 0 && bLengthLeft > 0; aPos -= 1, bPos -= 1, resultPos -= 1, aLengthLeft -= 1, bLengthLeft -= 1) {
        // add the two numbers together
        tmp = a.value[aPos] + b.value[bPos] + carry;
        // check if they are >= 10 (impossible to be more then 18)
        if (tmp >= common_1.DECIMAL_RADIX) {
            carry = 1;
            tmp -= common_1.DECIMAL_RADIX; // yep, subtract 10, add a carry
        }
        else {
            carry = 0;
        }
        result.value[resultPos] = tmp;
    }
    // Now add carry the [rest of the] longer integer part.
    if (aLengthLeft === 0) {
        // n2 is a bigger number then n1
        for (; bLengthLeft > 0; bLengthLeft -= 1, bPos -= 1, resultPos -= 1) {
            tmp = b.value[bPos] + carry;
            if (tmp >= common_1.DECIMAL_RADIX) {
                carry = 1;
                tmp -= common_1.DECIMAL_RADIX;
            }
            else {
                carry = 0;
            }
            result.value[resultPos] = tmp;
        }
    }
    else {
        // n1 is bigger then n2..
        for (; aLengthLeft > 0; aLengthLeft -= 1, aPos -= 1, resultPos -= 1) {
            tmp = a.value[aPos] + carry;
            if (tmp >= common_1.DECIMAL_RADIX) {
                carry = 1;
                tmp -= common_1.DECIMAL_RADIX;
            }
            else {
                carry = 0;
            }
            result.value[resultPos] = tmp;
        }
    }
    // Set final carry.
    if (carry === 1) {
        result.value[resultPos] += 1;
    }
    return removeLeadingZeroes_1.default(result);
}
exports.default = addUnsigned;
