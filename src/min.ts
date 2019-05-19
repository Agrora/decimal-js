import { DecimalInfo } from './common';
import compare from './compare';

export default function min(...values: DecimalInfo[]): DecimalInfo {
    if (values.length < 2) {
        throw Error('At least two values must be given');
    }
    if (values.length === 2) {
        return compare(values[0], values[1]) === 1 ? values[1] : values[0];
    }
    values.sort(compare);
    return values[0];
}
