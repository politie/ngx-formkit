const isEmptyObject = (object: Record<string, any>): boolean => !!(object && Object.keys(object).length === 0 && object.constructor === Object);
const truthyArrayValuesLength = (arr: Record<any, any>): number => !Array.isArray(arr) ? 0 : arr.filter((v: any) => (v)).length;

export const utilities = {
  isEmptyObject,
  truthyArrayValuesLength
};
