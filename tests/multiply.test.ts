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
        ['-0.1', '5', undefined, '-0.5'],
        ['-9223372036854775807', '9223372036854775807', undefined, '-85070591730234615847396907784232501249'],
        ['-5', '-5', undefined, '25'],
        ['500', '-2', undefined, '-1000'],
        ['-0.114', '6.74', 5, '-0.76836'],
        ['-6.6', '6.6', 2, '-43.56'],
        ['0.000', '0.000', 2, '0.00'],

    ];

    jestEach(data).it('should correctly multiply %s and %s', (a, b, scale, expectedResult) => {
        expect(multiply(
            createInfoFromString(a),
            createInfoFromString(b),
            scale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
