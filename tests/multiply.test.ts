import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import multiply from '../src/multiply';

describe('multiply', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['0', '0', undefined, '0'],
        ['1', '1', undefined, '1'],
        ['1', '2', undefined, '2'],
        ['1', '3', undefined, '3'],
        ['6', '6', undefined, '36'],
        ['6.6', '6.6', undefined, '43.5'],
        ['3161.6988', '-6464.1651', 10, '-20437743.03967188'],
    ];

    jestEach(data).it('should correctly multiply %s and %s', (a, b, scale, expectedResult) => {
        expect(multiply(
            createInfoFromString(a),
            createInfoFromString(b),
            scale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
