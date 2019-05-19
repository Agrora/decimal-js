import jestEach from 'jest-each';
import { createInfoFromString } from '../src/common';
import min from '../src/min';

describe('min', () => {
    const data: Array<[string[], string]> = [
        [['1', '0', '-1'], '-1'],
        [['-1', '0', '1'], '-1'],
        [['0', '-1', '1'], '-1'],
    ];

    jestEach(data).it('should correctly return min', (values, expectedResult) => {
        expect(min(
            ...values.map(createInfoFromString),
        )).toEqual(createInfoFromString(expectedResult));
    });
});
