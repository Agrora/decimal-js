import jestEach from 'jest-each';
import isZero from '../src/isZero';
import { createInfoFromString } from '../src/common';

describe('isZero', () => {
    const data: Array<[string, boolean]> = [
        ['0', true],
        ['0.0', true],
        ['000.000', true],
        ['1', false],
        ['-1', false],
        ['001', false],
        ['100', false],
    ];

    jestEach(data).it('should tell if %s is zero', (info, expectedResult) => {
        expect(isZero(createInfoFromString(info))).toEqual(expectedResult);
    });
});
