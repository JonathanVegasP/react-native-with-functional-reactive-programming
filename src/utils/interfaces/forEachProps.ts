import { Handler } from '../../observable/types/handler';
import { PredicateProps } from './predicateProps';

interface ForEachProps<T> {
  array: T[];
  predicate: Handler<PredicateProps<T>, void | false>;
}

export type { ForEachProps };
