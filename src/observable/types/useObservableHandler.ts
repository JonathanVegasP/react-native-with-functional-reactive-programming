import { Observable } from '../interfaces/observable';
import { Nullable } from './nullable';

type UseObservableHandler = <T = unknown>(
  initialValue?: Nullable<T>,
) => Observable<T>;

export type { UseObservableHandler };
