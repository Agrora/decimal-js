import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import subtract from '../src/subtract';

describe('subtract', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['0', '0', undefined, '0'],
        ['0.0', '0.0', undefined, '0.0'],
        ['000.000', '0.0000', undefined, '0.0000'],
        ['2', '1', undefined, '1'],
        ['1', '2', undefined, '-1'],
        ['1', '3', undefined, '-2'],
        ['33', '22', undefined, '11'],
        ['1000', '300', undefined, '700'],
        ['1.2', '0.1', undefined, '1.1'],
        ['123.123', '23.023', undefined, '100.100'],
        ['123.123', '23.023', 5, '100.10000'],
        ['-5', '3', undefined, '-8'], // Signs will not be ignored
        ['-1.234', '1.234', undefined, '-2.468'],
        ['9224372036854775807' , '9223372036854775827', undefined, '999999999999980'],
        ['-9223372036854775807' , '-9223372036854775807', undefined, '0'],
        ['9223372036854775807' , '9223372036854775807', undefined, '0'],
        ['0.9223372036854775807' , '0.9223372036854775807', undefined, '0.0000000000000000000'],
        ['6455.05', '5455.04', undefined, '1000.01'],
        ['0', '0.5', undefined, '-0.5'],
        ['-1000', '-1000', undefined, '0'],
        ['-0.4', '-0.3', undefined, '-0.1'],
        ['-4.45799', '-0.97846', undefined, '-3.47953'],
        ['0.000002', '0.000001', undefined, '0.000001'],
        ['1.634', '7777.778', undefined, '-7776.144'],
        ];

    jestEach(data).it('should correctly subtract %s and %s', (a, b, minScale, expectedResult) => {
        expect(subtract(
            createInfoFromString(a),
            createInfoFromString(b),
            minScale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
