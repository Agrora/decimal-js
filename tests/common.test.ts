import jestEach from 'jest-each';
import { createInfo, createInfoFromString, DecimalInfo, DecimalSign } from '../src/common';

describe('createInfo', () => {
    const data: Array<[number|undefined, number|undefined, DecimalInfo]> = [
        [undefined, undefined, {
            length: 1,
            scale: 0,
            sign: DecimalSign.PLUS,
            value: new Uint8Array([0]),
        }],
        [5, undefined, {
            length: 5,
            scale: 0,
            sign: DecimalSign.PLUS,
            value: new Uint8Array([0, 0, 0, 0, 0]),
        }],
        [1, 5, {
            length: 1,
            scale: 5,
            sign: DecimalSign.PLUS,
            value: new Uint8Array([0, 0, 0, 0, 0, 0]),
        }],
        [4, 7, {
            length: 4,
            scale: 7,
            sign: DecimalSign.PLUS,
            value: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        }],
    ];

    jestEach(data).it('should create a decimal info with length %d, scale %d', (length, scale, expectedInfo) => {
        expect(createInfo(length, scale)).toEqual(expectedInfo);
    });
});

describe('createInfoFromString', () => {
    const data: Array<[string, DecimalInfo]> = [
        ['0', createInfo()],
        ['1', { ...createInfo(), value: new Uint8Array([1]) }],
        ['12', { ...createInfo(2), value: new Uint8Array([1, 2]) }],
        ['123', { ...createInfo(3), value: new Uint8Array([1, 2, 3]) }],
        ['1.12', { ...createInfo(1, 2), value: new Uint8Array([1, 1, 2]) }],
        ['12.12', { ...createInfo(2, 2), value: new Uint8Array([1, 2, 1, 2]) }],
        ['123.1', { ...createInfo(3, 1), value: new Uint8Array([1, 2, 3, 1]) }],
        ['1234.1234', { ...createInfo(4, 4), value: new Uint8Array([1, 2, 3, 4, 1, 2, 3, 4]) }],
        ['0001.001', { ...createInfo(1, 3), value: new Uint8Array([1, 0, 0, 1]) }],
        ['0.123', { ...createInfo(1, 3), value: new Uint8Array([0, 1, 2, 3]) }],
    ];

    const invalidValues = [
        '.123',
        '123.',
        'a34',
        '34a',
        '123.a32',
        '123.32a',
        '1a2.234',
        '234.2a4',
        '',
        ' ',
        ' 0',
        '0 ',
    ];

    jestEach(data).it('should correctly parse the string %s', (decimalString, expectedInfo) => {
        expect(createInfoFromString(decimalString)).toEqual(expectedInfo);
    });

    jestEach(invalidValues).it('should throw an error for string %s', decimalString => {
        expect(() => createInfoFromString(decimalString)).toThrow();
    });
});
