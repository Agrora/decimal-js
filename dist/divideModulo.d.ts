import { DecimalInfo } from './common';
/**
 * Division *and* modulo for numbers.  This computes both NUM1 / NUM2 and
 * NUM1 % NUM2  and puts the results in QUOT and REM, except that if QUOT
 * is NULL then that store will be omitted.
 */
export default function divideModulo(num1: DecimalInfo, num2: DecimalInfo, scale?: number): [DecimalInfo, DecimalInfo];
