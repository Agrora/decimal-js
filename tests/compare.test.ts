import jestEach from 'jest-each';
import { createInfoFromString, DecimalComparisonResult } from '../src/common';
import compare from '../src/compare';

describe('addUnsigned', () => {
    const data: Array<[string, string, boolean|undefined, boolean|undefined, DecimalComparisonResult]> = [
        ['0', '0', undefined, undefined, 0],
        ['1', '0', undefined, undefined, 1],
        ['0', '1', undefined, undefined, -1],
        ['1', '-1', undefined, undefined, 1],
        ['1', '-1', false, undefined, 0],
        ['-1', '1', false, undefined, 0],
        ['-1', '1', undefined, undefined, -1],
        ['0.001', '0.002', undefined, undefined, -1],
        ['0.002', '0.001', undefined, undefined, 1],
        ['0', '0.000', undefined, undefined, 0],
    ];

    jestEach(data).it('should correctly compare %s and %s', (a, b, useSign, ignoreLast, expectedResult) => {
        expect(compare(
            createInfoFromString(a),
            createInfoFromString(b),
            useSign,
            ignoreLast,
        )).toEqual(expectedResult);
    });
});
