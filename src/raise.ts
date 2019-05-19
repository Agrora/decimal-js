import { copyInfo, createInfoFromArray, createStringFromInfo, DECIMAL_RADIX, DecimalInfo, INFO_ONE } from './common';
import divide from './divide';
import multiply from './multiply';

const { min, max } = Math;

// bcmath equivalent: bc_raise
/**
 * Raise NUM1 to the NUM2 power.  The result is placed in RESULT.
 * Maximum exponent is LONG_MAX.  If a NUM2 is not an integer,
 * only the integer part is used.
 */
export default function raise(a: DecimalInfo, b: DecimalInfo, scale: number = max(a.scale, b.scale)) {
    /* Check the exponent for scale digits and convert to a long. */
    if (b.scale > 0) {
        throw Error('Trying to build power with non-integral exponent');
    }
    let exponent = parseInt(createStringFromInfo(b), DECIMAL_RADIX);
    if (isNaN(exponent) || (exponent === 0 && (b.length > 1 || b.value[0] !== 0))) {
        throw Error('Exponent too large in raise');
    }

    /* Special case if exponent is a zero. */
    if (exponent === 0) {
        return createInfoFromArray([1], scale);
    }

    let neg;
    let rscale;
    /* Other initializations. */
    if (exponent < 0) {
        neg = true;
        exponent = -exponent;
        rscale = scale;
    } else {
        neg = false;
        rscale = min(a.scale * exponent, max(scale, a.scale));
    }

    /* Set initial value of temp.  */
    let power = copyInfo(a);
    let pwrscale = a.scale;
    while ((exponent & 1) === 0) {
        pwrscale = 2 * pwrscale;
        power = multiply(power, power, pwrscale);
        exponent = exponent >> 1;
    }
    let temp = copyInfo(power);
    let calcscale = pwrscale;
    exponent = exponent >> 1;

    /* Do the calculation. */
    while (exponent > 0) {
        pwrscale = 2 * pwrscale;
        power = multiply(power, power, pwrscale);
        if ((exponent & 1) === 1) {
            calcscale = pwrscale + calcscale;
            temp = multiply(temp, power, calcscale);
        }
        exponent = exponent >> 1;
    }

    let result;
    /* Assign the value. */
    if (neg) {
        result = divide(INFO_ONE, temp, rscale);
    } else {
        result = temp;
        if (result.scale > rscale) {
            result.scale = rscale;
            if (result.value.length > result.length + result.scale) {
                result.value = result.value.subarray(0, result.length + result.scale);
            }
        }
    }
    return result;
}
