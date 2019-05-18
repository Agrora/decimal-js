import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import subtractUnsigned from '../src/subtractUnsigned';

describe('subtractUnsigned', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['0', '0', undefined, '0'],
        ['0.0', '0.0', undefined, '0.0'],
        ['000.000', '0.0000', undefined, '0.0000'],
        ['2', '1', undefined, '1'],
        // subtracting a higher number from a smaller one will rotate around the radix of 10
        // 9, in this case (as 1 - 1 = 0, 1 - 2 = 9), unsigned!
        ['1', '2', undefined, '9'],
        ['1', '3', undefined, '8'],
        ['33', '22', undefined, '11'],
        ['1000', '300', undefined, '700'],
        ['1.2', '0.1', undefined, '1.1'],
        ['123.123', '23.023', undefined, '100.100'],
        ['123.123', '23.023', 5, '100.10000'],
        ['-5', '3', undefined, '2'], // Signs will be ignored
    ];

    jestEach(data).it('should correctly subtract %s and %s', (a, b, minScale, expectedResult) => {
        expect(subtractUnsigned(
            createInfoFromString(a),
            createInfoFromString(b),
            minScale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
