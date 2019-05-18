import { DecimalInfo } from './common';

export default function isZero(a: DecimalInfo): boolean {
    const length = a.length + a.scale;
    for (let i = 0; i < length; i += 1) {
        if (a.value[i] !== 0) {
            return false;
        }
    }
    return true;
}
