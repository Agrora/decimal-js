import jestEach from 'jest-each';
import { createInfo, DecimalInfo } from '../src/common';
import removeLeadingZeroes from '../src/removeLeadingZeroes';

describe('removeLeadingZeroes', () => {
    const data: Array<[number, DecimalInfo, DecimalInfo]> = [
        [
            1,
            { ...createInfo(1), value: new Uint8Array([0]) },
            { ...createInfo(1), value: new Uint8Array([0]) },
        ],
        [
            2,
            { ...createInfo(3, 3), value: new Uint8Array([0, 0, 4, 0, 0, 1]) },
            { ...createInfo(1, 3), value: new Uint8Array([4, 0, 0, 1]) },
        ],
        [
            3,
            { ...createInfo(1, 3), value: new Uint8Array([9, 1, 2, 1]) },
            { ...createInfo(1, 3), value: new Uint8Array([9, 1, 2, 1]) },
        ],
        [
            4,
            { ...createInfo(3), value: new Uint8Array([0, 0, 7]) },
            { ...createInfo(1), value: new Uint8Array([7]) },
        ],
    ];

    jestEach(data).it('should correctly strip zeroes from dataset %d', (_1, inputInfo, expectedInfo) => {
        expect(removeLeadingZeroes(inputInfo)).toEqual(expectedInfo);
    });
});
