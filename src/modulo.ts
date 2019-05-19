import { DecimalInfo } from './common';
import divideModulo from './divideModulo';

// bcmath equivalent: bc_mod
/**
 * Division *and* modulo for numbers.  This computes both NUM1 / NUM2 and
 * NUM1 % NUM2  and puts the results in QUOT and REM, except that if QUOT
 * is NULL then that store will be omitted.
 */
const { max } = Math;

export default function modulo(
    a: DecimalInfo,
    b: DecimalInfo,
    scale: number = max(a.scale, b.scale),
): DecimalInfo {
    return divideModulo(a, b, scale)[1];
}
