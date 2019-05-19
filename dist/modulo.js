"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const divideModulo_1 = __importDefault(require("./divideModulo"));
// bcmath equivalent: bc_mod
/**
 * Division *and* modulo for numbers.  This computes both NUM1 / NUM2 and
 * NUM1 % NUM2  and puts the results in QUOT and REM, except that if QUOT
 * is NULL then that store will be omitted.
 */
const { max } = Math;
function modulo(a, b, scale = max(a.scale, b.scale)) {
    return divideModulo_1.default(a, b, scale)[1];
}
exports.default = modulo;
