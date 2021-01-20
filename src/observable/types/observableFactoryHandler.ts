import { Observable } from '../interfaces/observable';
import { Nullable } from './nullable';

type ObservableFactoryHandler = <T = unknown>(
  initialValue?: Nullable<T>,
) => Observable<T>;

export type { ObservableFactoryHandler };
