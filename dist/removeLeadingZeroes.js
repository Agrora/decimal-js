"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// bcmath equivalent: _bc_rm_leading_zeros
function removeLeadingZeroes(info) {
    let zeroCount = 0;
    while ((info.value[zeroCount] === 0) && (info.length - zeroCount > 1)) {
        zeroCount += 1;
    }
    if (zeroCount > 0) {
        return {
            length: info.length - zeroCount,
            scale: info.scale,
            sign: info.sign,
            value: info.value.subarray(zeroCount),
        };
    }
    return info;
}
exports.default = removeLeadingZeroes;
