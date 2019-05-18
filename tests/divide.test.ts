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
        ['-3', '2', 1, '-1.5'],
        ['99923372036854775807', '2', undefined, '49961686018427387903'],
        ['-0.55', '-4.322', 7, '0.1272559'],
        ['1111.2', '-0.2', undefined, '-5556.0'],
        ['99923372036854775807.22', '74658.78999', undefined, '1338400636418548.73580'],
        ['']
    ];

    jestEach(data).it('should correctly divide %s by %s', (a, b, scale, expectedResult) => {
        expect(divide(
            createInfoFromString(a),
            createInfoFromString(b),
            scale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
