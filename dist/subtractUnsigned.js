"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const removeLeadingZeroes_1 = __importDefault(require("./removeLeadingZeroes"));
const { max, min } = Math;
// bcmath equivalent: _bc_do_sub
function subtractUnsigned(a, b, minScale = 0) {
    const maxLength = max(a.length, b.length);
    const valueMaxScale = max(a.scale, b.scale);
    const minLength = min(a.length, b.length);
    const valueMinScale = min(a.scale, b.scale);
    const result = common_1.createInfo(maxLength, max(valueMaxScale, minScale));
    // Initialize the subtract.
    let aPos = (a.length + a.scale - 1);
    let bPos = (b.length + b.scale - 1);
    let resultPos = (maxLength + valueMaxScale - 1);
    // Subtract the numbers.
    let borrow = 0;
    let count;
    let val;
    // Take care of the longer scaled number.
    if (a.scale !== valueMinScale) {
        // a has the longer scale
        for (count = a.scale - valueMinScale; count > 0; count -= 1) {
            result.value[resultPos] = a.value[aPos];
            resultPos -= 1;
            aPos -= 1;
        }
    }
    else {
        // b has the longer scale
        for (count = b.scale - valueMinScale; count > 0; count -= 1, bPos -= 1, resultPos -= 1) {
            val = 0 - b.value[bPos] - borrow;
            bPos -= 1;
            if (val < 0) {
                val += common_1.DECIMAL_RADIX;
                borrow = 1;
            }
            else {
                borrow = 0;
            }
            result.value[resultPos] = val;
        }
    }
    // Now do the equal length scale and integer parts.
    for (count = 0; count < minLength + valueMinScale; count += 1, aPos -= 1, bPos -= 1, resultPos -= 1) {
        val = a.value[aPos] - b.value[bPos] - borrow;
        if (val < 0) {
            val += common_1.DECIMAL_RADIX;
            borrow = 1;
        }
        else {
            borrow = 0;
        }
        result.value[resultPos] = val;
    }
    // If a has more digits then b, we now do that subtract.
    if (maxLength !== minLength) {
        for (count = maxLength - minLength; count > 0; count -= 1, aPos -= 1, resultPos -= 1) {
            val = a.value[aPos] - borrow;
            if (val < 0) {
                val += common_1.DECIMAL_RADIX;
                borrow = 1;
            }
            else {
                borrow = 0;
            }
            result.value[resultPos] = val;
        }
    }
    return removeLeadingZeroes_1.default(result);
}
exports.default = subtractUnsigned;
