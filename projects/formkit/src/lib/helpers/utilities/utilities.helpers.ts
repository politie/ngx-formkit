const isEmptyObject = (object: Record<string, any>): boolean => !!(object && Object.keys(object).length === 0 && object.constructor === Object);

export const utilities = {
  isEmptyObject
};
