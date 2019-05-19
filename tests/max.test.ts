import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import max from '../src/max';

describe('max', () => {
    const data: Array<[string[], string]> = [
        [['1', '0', '-1'], '1'],
        [['-1', '0', '1'], '1'],
        [['0', '-1', '1'], '1'],
    ];

    jestEach(data).it('should correctly return max', (values, expectedResult) => {
        expect(max(
            ...values.map(createInfoFromString),
        )).toEqual(createInfoFromString(expectedResult));
    });
});
