export const DECIMAL_VALIDATION_REGEX = /^[+\-]?\d+(\.\d+)?$/;
export const DECIMAL_RADIX = 10;

export enum DecimalSign {
    PLUS = '+',
    MINUS = '-',
}

export interface DecimalInfo {
    sign: DecimalSign;
    value: Uint8Array;
    length: number;
    scale: number;
}

export type DecimalComparisonResult = 1|0|-1;
export type DecimalLike = string|number|DecimalInfo;

export const INFO_ZERO = createInfo();
export const INFO_ONE = createInfoFromArray([1]);
export const INFO_MINUS_ONE = negate(createInfoFromArray([1]));

export function createInfo(length: number = 1, scale: number = 0): DecimalInfo {
    return { length, scale, sign: DecimalSign.PLUS, value: new Uint8Array(length + scale) };
}

export function createInfoFromArray(
    value: ArrayLike<number>,
    length: number = value.length,
    scale: number = value.length - length,
    offset: number = 0,
): DecimalInfo {
    const info = createInfo(length, scale);
    info.value.set(value, offset);
    return info;
}

export function createInfoFromString(value: string): DecimalInfo {
    if (typeof value !== 'string') {
        throw new TypeError(`Invalid ${typeof value} argument passed, string expected`);
    }
    if (!value.match(DECIMAL_VALIDATION_REGEX)) {
        throw Error(`Invalid decimal string ${value} provided`);
    }
    let normalizedValue = value;
    let sign = DecimalSign.PLUS;
    const firstChar = value.charAt(0);
    if (firstChar === DecimalSign.PLUS || firstChar === DecimalSign.MINUS) {
        if (firstChar === DecimalSign.MINUS) {
            sign = DecimalSign.MINUS;
        }
        normalizedValue = normalizedValue.substr(1);
    }

    normalizedValue = normalizedValue.replace(/^0+([0-9])/, '$1');

    const dotIndex = normalizedValue.indexOf('.');
    let length = normalizedValue.length;
    let scale = 0;
    if (dotIndex !== -1) {
        scale = length - (dotIndex + 1);
        length -= (scale + 1);
        normalizedValue = normalizedValue.replace('.', '');
    }

    return { ...createInfoFromArray(
        normalizedValue.split('').map(c => parseInt(c, DECIMAL_RADIX)),
        length,
        scale,
    ), sign };
}

export function createStringFromInfo(info: DecimalInfo, scale = info.scale): string {
    let str = info.value.subarray(0, info.length).join('');
    if (scale > 0) {
        str += `.${info.value.subarray(info.length, info.length + scale).join('')}`;
    }
    return (info.sign === DecimalSign.MINUS ? DecimalSign.MINUS : '') + str;
}

// bcmath equivalent: new_sub_num
export function createSubInfo(
    info: DecimalInfo,
    length: number = info.length,
    scale: number = info.scale,
    offset: number = 0,
    targetOffset: number = 0,
): DecimalInfo {
    return createInfoFromArray(info.value.subarray(offset), length, scale, targetOffset);
}

export function copyInfo(info: DecimalInfo): DecimalInfo {
    return {
        sign: info.sign,
        length: info.length,
        scale: info.scale,
        value: new Uint8Array(info.value),
    };
}

export function isInfo(value: any): value is DecimalInfo {
    return typeof value === 'object'
        && value !== null
        && typeof value.length === 'number'
        && typeof value.scale === 'number'
        && (typeof value.sign === 'string' && [DecimalSign.PLUS, DecimalSign.MINUS].includes(value.sign))
        && (typeof value.value === 'object' && value.value instanceof Uint8Array);
}

export function negate(info: DecimalInfo): DecimalInfo {
    return { ...info, sign: info.sign === DecimalSign.PLUS ? DecimalSign.MINUS : DecimalSign.PLUS };
}
