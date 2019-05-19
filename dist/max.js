"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = __importDefault(require("./compare"));
function max(...values) {
    if (values.length < 2) {
        throw Error('At least two values must be given');
    }
    if (values.length === 2) {
        return compare_1.default(values[0], values[1]) === 1 ? values[0] : values[1];
    }
    values.sort(compare_1.default);
    return values[values.length - 1];
}
exports.default = max;
