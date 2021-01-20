import { RemoveProps } from './interfaces/removeProps';

const remove = <T>({ array, predicate }: RemoveProps<T>) => {
  let index = -1,
    length = array.length;

  const results: number[] = [];

  while (index++ < length) {
    if (predicate({ array, value: array[index], index })) {
      results.push(index);
    }
  }

  length = results.length;

  while (length--) {
    Array.prototype.splice.call(array, results[length], 1);
  }
};

export { remove };
