import add from './add';
import addUnsigned from './addUnsigned';
import {
    copyInfo,
    createInfo,
    createInfoFromArray,
    createInfoFromString,
    createStringFromInfo,
    createSubInfo,
    DecimalLike,
    isInfo,
} from './common';
import compare from './compare';
import Decimal from './Decimal';
import divide from './divide';
import isZero from './isZero';
import multiply from './multiply';
import removeLeadingZeroes from './removeLeadingZeroes';
import subtract from './subtract';
import subtractUnsigned from './subtractUnsigned';

export default Decimal;
export {
    createInfo,
    createInfoFromArray,
    createInfoFromString,
    createStringFromInfo,
    createSubInfo,
    copyInfo,

    add,
    addUnsigned,
    subtract,
    subtractUnsigned,
    multiply,
    divide,

    compare,

    isZero,
    removeLeadingZeroes,
};

export function parseDecimal(value: DecimalLike): Decimal {
    return Decimal.from(value);
}

export function isDecimal(value: unknown): value is Decimal {
    return value instanceof Decimal;
}

export function isDecimalLike(value: unknown): value is DecimalLike {
    return isDecimal(value) || ['string', 'number'].includes(typeof value) || isInfo(value);
}
