import { Handler } from '../../observable/types/handler';
import { PredicateProps } from './predicateProps';

interface RemoveProps<T> {
  array: T[];
  predicate: Handler<PredicateProps<T>, boolean>;
}

export type { RemoveProps };
