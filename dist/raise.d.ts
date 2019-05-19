import { DecimalInfo } from './common';
/**
 * Raise NUM1 to the NUM2 power.  The result is placed in RESULT.
 * Maximum exponent is LONG_MAX.  If a NUM2 is not an integer,
 * only the integer part is used.
 */
export default function raise(a: DecimalInfo, b: DecimalInfo, scale?: number): DecimalInfo;
