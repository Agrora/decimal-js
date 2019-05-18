import { DecimalComparisonResult, DecimalInfo, DecimalSign } from './common';

const { min } = Math;

export default function compare(
    a: DecimalInfo,
    b: DecimalInfo,
    useSign: boolean = true, ignoreLast: boolean = false,
): DecimalComparisonResult {
    // First, compare signs.
    if (useSign && a.sign !== b.sign) {
        return a.sign === DecimalSign.PLUS ? 1 : -1;
    }

    // Now compare the magnitude.
    if (a.length !== b.length) {
        if (a.length > b.length) { // Magnitude of n1 > n2.
            return !useSign || a.sign === DecimalSign.PLUS ? 1 : -1;
        }
        return !useSign || a.sign === DecimalSign.PLUS ? -1 : 1;
    }

    /* If we get here, they have the same number of integer digits.
       check the integer part and the equal length part of the fraction. */
    let count = a.length + min(a.scale, b.scale);
    let aPos = 0;
    let bPos = 0;

    while ((count > 0) && (a.value[aPos] === b.value[bPos])) {
        aPos += 1;
        bPos += 1;
        count -= 1;
    }

    if (ignoreLast && (count === 1) && (a.scale === b.scale)) {
        return 0;
    }

    if (count !== 0) {
        if (a.value[aPos] > b.value[bPos]) { // Magnitude of n1 > n2.
            return !useSign || a.sign === DecimalSign.PLUS ? 1 : -1;
        }
        return !useSign || a.sign === DecimalSign.PLUS ? -1 : 1;
    }

    // They are equal up to the last part of the equal part of the fraction.
    if (a.scale !== b.scale) {
        if (a.scale > b.scale) {
            for (count = (a.scale - b.scale); count > 0; count -= 1, aPos += 1) {
                if (a.value[aPos] !== 0) { // Magnitude of n1 > n2.
                    return !useSign || a.sign === DecimalSign.PLUS ? 1 : -1;
                }
            }
        } else {
            for (count = (b.scale - a.scale); count > 0; count -= 1, bPos += 1) {
                if (b.value[bPos] !== 0) { // Magnitude of n1 < n2.
                    return !useSign || a.sign === DecimalSign.PLUS ? -1 : 1;
                }
            }
        }
    }

    // They must be equal!
    return 0;
}
