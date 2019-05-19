"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECIMAL_VALIDATION_REGEX = /^[+\-]?\d+(\.\d+)?$/;
exports.DECIMAL_RADIX = 10;
var DecimalSign;
(function (DecimalSign) {
    DecimalSign["PLUS"] = "+";
    DecimalSign["MINUS"] = "-";
})(DecimalSign = exports.DecimalSign || (exports.DecimalSign = {}));
exports.INFO_ZERO = createInfo();
exports.INFO_ONE = createInfoFromArray([1]);
exports.INFO_MINUS_ONE = negate(createInfoFromArray([1]));
function createInfo(length = 1, scale = 0) {
    return { length, scale, sign: DecimalSign.PLUS, value: new Uint8Array(length + scale) };
}
exports.createInfo = createInfo;
function createInfoFromArray(value, length = value.length, scale = value.length - length, offset = 0) {
    const info = createInfo(length, scale);
    info.value.set(value, offset);
    return info;
}
exports.createInfoFromArray = createInfoFromArray;
function createInfoFromString(value) {
    if (typeof value !== 'string') {
        throw new TypeError(`Invalid ${typeof value} argument passed, string expected`);
    }
    if (!value.match(exports.DECIMAL_VALIDATION_REGEX)) {
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
    return Object.assign({}, createInfoFromArray(normalizedValue.split('').map(c => parseInt(c, exports.DECIMAL_RADIX)), length, scale), { sign });
}
exports.createInfoFromString = createInfoFromString;
function createStringFromInfo(info, scale = info.scale) {
    let str = info.value.subarray(0, info.length).join('');
    if (scale > 0) {
        str += `.${info.value.subarray(info.length, info.length + scale).join('')}`;
    }
    return (info.sign === DecimalSign.MINUS ? DecimalSign.MINUS : '') + str;
}
exports.createStringFromInfo = createStringFromInfo;
// bcmath equivalent: new_sub_num
function createSubInfo(info, length = info.length, scale = info.scale, offset = 0, targetOffset = 0) {
    return createInfoFromArray(info.value.subarray(offset), length, scale, targetOffset);
}
exports.createSubInfo = createSubInfo;
function copyInfo(info) {
    return {
        sign: info.sign,
        length: info.length,
        scale: info.scale,
        value: new Uint8Array(info.value),
    };
}
exports.copyInfo = copyInfo;
function isInfo(value) {
    return typeof value === 'object'
        && value !== null
        && typeof value.length === 'number'
        && typeof value.scale === 'number'
        && (typeof value.sign === 'string' && [DecimalSign.PLUS, DecimalSign.MINUS].includes(value.sign))
        && (typeof value.value === 'object' && value.value instanceof Uint8Array);
}
exports.isInfo = isInfo;
function negate(info) {
    return Object.assign({}, info, { sign: info.sign === DecimalSign.PLUS ? DecimalSign.MINUS : DecimalSign.PLUS });
}
exports.negate = negate;
