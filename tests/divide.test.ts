import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import divide from '../src/divide';

describe('divide', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['10', '2', undefined, '5'],
        ['1', '2', undefined, '0'],
        ['1', '2', 1, '0.5'],
        ['1.0', '2', undefined, '0.5'],
        ['1', '0.2', undefined, '5.0'],
    ];

    jestEach(data).it('should correctly divide %s by %s', (a, b, scale, expectedResult) => {
        expect(divide(
            createInfoFromString(a),
            createInfoFromString(b),
            scale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
