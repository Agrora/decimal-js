import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import raise from '../src/raise';

describe('raise', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['2', '5', undefined, '32'],
    ];

    jestEach(data).it('should correctly raise %s by %s', (a, b, scale, expectedResult) => {
        expect(raise(
            createInfoFromString(a),
            createInfoFromString(b),
            scale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
