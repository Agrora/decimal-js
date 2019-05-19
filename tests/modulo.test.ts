import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import modulo from '../src/modulo';

describe('modulo', () => {
    const data: Array<[string, string, number|undefined, string]> = [
        ['0', '4', undefined, '0'],
        ['4', '3', undefined, '1'],
        ['19', '4', undefined, '3'],
    ];

    jestEach(data).it('should correctly build modulo of %s and %s', (a, b, minScale, expectedResult) => {
        expect(modulo(
            createInfoFromString(a),
            createInfoFromString(b),
            minScale,
        )).toEqual(createInfoFromString(expectedResult));
    });
});
