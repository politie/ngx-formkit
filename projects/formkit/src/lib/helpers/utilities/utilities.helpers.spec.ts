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
});
