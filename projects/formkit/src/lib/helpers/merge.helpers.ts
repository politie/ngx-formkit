/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
export const merge = <T>(target: T, source: Partial<T>): T => {
  const isObject = (obj: Partial<T>) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source as T;
  }

  Object.keys(source).forEach((key) => {
    // @ts-ignore
    const targetValue = target[key];
    // @ts-ignore
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // @ts-ignore
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key as keyof T] = merge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key as keyof T] = sourceValue;
    }
  });

  return target as T;
};
