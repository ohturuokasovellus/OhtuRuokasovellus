import { convertKJ2Kcal, convertKcal2KJ } from '../utils/KJKcalConverter';

describe('convertKJ2Kcal', () => {
    test(
        'should convert number kJ to kcal and round to one decimal point',
        () => {
            expect(convertKJ2Kcal(500)).toBe(119.5);
        });

    test(
        'should convert string kJ to kcal and round to one decimal point',
        () => {
            expect(convertKJ2Kcal('500')).toBe(119.5);
        });

    test('should throw error for invalid string input', () => {
        expect(() => convertKJ2Kcal('abc'))
            .toThrow('invalid input: abc is not a number');
    });

    test('should throw error for undefined input', () => {
        expect(() => convertKJ2Kcal(undefined))
            .toThrow('invalid input: undefined is not a number');
    });

    test('should throw error for null input', () => {
        expect(() => convertKJ2Kcal(null))
            .toThrow('invalid input: null is not a number');
    });
});

describe('convertKcal2KJ', () => {
    test('should convert number kcal to kJ and round to one decimal point',
        () => {
            expect(convertKcal2KJ(500)).toBe(2092.0);
        });

    test('should convert string kcal to kJ and round to one decimal point',
        () => {
            expect(convertKcal2KJ('500')).toBe(2092.0);
        });

    test('should throw error for invalid string input', () => {
        expect(() => convertKcal2KJ('abc'))
            .toThrow('invalid input: abc is not a number');
    });

    test('should throw error for undefined input', () => {
        expect(() => convertKcal2KJ(undefined))
            .toThrow('invalid input: undefined is not a number');
    });

    test('should throw error for null input', () => {
        expect(() => convertKcal2KJ(null))
            .toThrow('invalid input: null is not a number');
    });
});
