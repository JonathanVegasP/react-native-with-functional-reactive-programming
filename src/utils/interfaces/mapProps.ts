import { Handler } from '../../observable/types/handler';
import { PredicateProps } from './predicateProps';

interface MapProps<T, R> {
  array: T[];
  predicate: Handler<PredicateProps<T>, R>;
}

export type { MapProps };
