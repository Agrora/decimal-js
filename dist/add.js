"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addUnsigned_1 = __importDefault(require("./addUnsigned"));
const common_1 = require("./common");
const compare_1 = __importDefault(require("./compare"));
const subtractUnsigned_1 = __importDefault(require("./subtractUnsigned"));
const { max } = Math;
// bcmath equivalent: bc_add
function add(a, b, scale = max(a.scale, b.scale)) {
    let result;
    if (a.sign === b.sign) {
        result = addUnsigned_1.default(a, b, scale);
        result.sign = a.sign;
        return result;
    }
    switch (compare_1.default(a, b, false)) {
        case -1:
            // n1 is less than n2, subtract n1 from n2.
            result = subtractUnsigned_1.default(b, a, scale);
            result.sign = b.sign;
            break;
        case 0:
            // They are equal! return zero with the correct scale!
            const resultScale = max(scale, max(a.scale, b.scale));
            result = common_1.createInfo(1, resultScale);
            break;
        case 1:
            // n2 is less than n1, subtract n2 from n1.
            result = subtractUnsigned_1.default(a, b, scale);
            result.sign = a.sign;
            break;
        default:
            throw Error('Invalid decimal comparison result');
    }
    return result;
}
exports.default = add;
