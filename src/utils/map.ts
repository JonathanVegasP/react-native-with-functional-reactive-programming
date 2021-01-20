import { MapProps } from './interfaces/mapProps';

const map = <T, R>({ array, predicate }: MapProps<T, R>): R[] => {
  let index = -1,
    length = array.length;
  const result: R[] = Array(length);

  while (++index < length) {
    result[index] = predicate({ index, array, value: array[index] });
  }

  return result;
};

export { map };
