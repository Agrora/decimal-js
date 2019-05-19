import addUnsigned from './addUnsigned';
import { createInfo, DecimalInfo } from './common';
import compare from './compare';
import subtractUnsigned from './subtractUnsigned';

const { max } = Math;

// bcmath equivalent: bc_add
export default function add(a: DecimalInfo, b: DecimalInfo, scale: number = max(a.scale, b.scale)): DecimalInfo {
    let result;

    if (a.sign === b.sign) {
        result = addUnsigned(a, b, scale);
        result.sign = a.sign;
        return result;
    }

    switch (compare(a, b, false)) {
        case -1:
            // n1 is less than n2, subtract n1 from n2.
            result = subtractUnsigned(b, a, scale);
            result.sign = b.sign;
            break;
        case 0:
            // They are equal! return zero with the correct scale!
            const resultScale = max(scale, max(a.scale, b.scale));
            result = createInfo(1, resultScale);
            break;
        case 1:
            // n2 is less than n1, subtract n2 from n1.
            result = subtractUnsigned(a, b, scale);
            result.sign = a.sign;
            break;
        default:
            throw Error('Invalid decimal comparison result');
    }
    return result;
}
