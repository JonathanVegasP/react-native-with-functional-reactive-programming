import { ForEachProps } from './interfaces/forEachProps';

const forEach = <T>({ array, predicate }: ForEachProps<T>) => {
  let i = -1,
    length = array.length;

  while (++i < length) {
    if (predicate({ index: i, array, value: array[i] }) === false) {
      break;
    }
  }
};

export { forEach };
