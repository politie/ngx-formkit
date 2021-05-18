import { utilities } from './utilities.helpers';

describe('Utilities', () => {
  describe('IsEmptyObject utility', () => {
    it('it should return a boolean indicating if the provided value is a empty object', () => {
      expect(utilities.isEmptyObject({})).toEqual(true);
      expect(utilities.isEmptyObject({ required: true })).toEqual(false);
      expect(utilities.isEmptyObject(null as any)).toEqual(false);
      expect(utilities.isEmptyObject(undefined as any)).toEqual(false);
      expect(utilities.isEmptyObject('object' as any)).toEqual(false);
      expect(utilities.isEmptyObject(() => {})).toEqual(false);
    });
  });

  describe('truthyArrayValuesLength utility', () => {
    it('it should return the length of the truthy values in the array', () => {
      expect(utilities.truthyArrayValuesLength(null as any)).toEqual(0);
      expect(utilities.truthyArrayValuesLength([false])).toEqual(0);
      expect(utilities.truthyArrayValuesLength([false, false])).toEqual(0);
      expect(utilities.truthyArrayValuesLength([true])).toEqual(1);
      expect(utilities.truthyArrayValuesLength([true, 1, {}])).toEqual(3);
      expect(utilities.truthyArrayValuesLength([null, 0, undefined])).toEqual(0);
      expect(utilities.truthyArrayValuesLength(['', ''])).toEqual(0);
    });
  });
});
