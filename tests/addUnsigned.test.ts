import jestEach from 'jest-each';
import addUnsigned from '../src/addUnsigned';
import { createInfoFromString } from '../src/common';

describe('addUnsigned', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['0', '0', undefined, '0'],
        ['0.0', '0.0', undefined, '0.0'],
        ['000.000', '0.0000', undefined, '0.0000'],
        ['1', '2', undefined, '3'],
        ['11', '22', undefined, '33'],
        ['1000', '300', undefined, '1300'],
        ['9', '5', undefined, '14'],
        ['96', '5', undefined, '101'],
        ['999993', '8', undefined, '1000001'],
        ['0.123', '0.123', undefined, '0.246'],
        ['123.123', '123.123', undefined, '246.246'],
        ['0.888', '1.003', undefined, '1.891'],
        ['0.888', '1.333', undefined, '2.221'],
        ['4', '5', 5, '9.00000'],
        ['1.1', '2.23', 6, '3.330000'],
        ['0.1', '0.2', undefined, '0.3'], // this returns 0.30000000000000004 in normal js floats
        ['-0.1', '0.1', undefined, '0.2'], // it will ignore signing (hence "addUnsigned" duh)
    ];

    jestEach(data).it('should correctly add %s and %s', (a, b, minScale, expectedResult) => {
        expect(addUnsigned(
            createInfoFromString(a),
            createInfoFromString(b),
            minScale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
