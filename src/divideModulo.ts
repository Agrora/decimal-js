import { DecimalInfo, INFO_ZERO } from './common';
import divide from './divide';
import isZero from './isZero';
import max from './max';
import multiply from './multiply';
import subtract from './subtract';

// bcmath equivalent: bc_divmod
/**
 * Division *and* modulo for numbers.  This computes both NUM1 / NUM2 and
 * NUM1 % NUM2  and puts the results in QUOT and REM, except that if QUOT
 * is NULL then that store will be omitted.
 */

export default function divideModulo(
    num1: DecimalInfo,
    num2: DecimalInfo,
    scale: number = Math.max(num1.scale, num2.scale),
): [DecimalInfo, DecimalInfo] {

    if (isZero(num2)) {
        throw Error('Division by zero');
    }

    /* Calculate final scale. */
    const resultScale = Math.max(num1.scale, num2.scale + scale);

    /* Calculate it. */
    const quotient = divide(num1, num2, 0);
    const temp = multiply(quotient, num2, resultScale);
    const remainder = subtract(num1, temp, resultScale);
    return [quotient, max(remainder, INFO_ZERO)];
}
