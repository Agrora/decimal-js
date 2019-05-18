"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isZero(a) {
    const length = a.length + a.scale;
    for (let i = 0; i < length; i += 1) {
        if (a.value[i] !== 0) {
            return false;
        }
    }
    return true;
}
exports.default = isZero;
