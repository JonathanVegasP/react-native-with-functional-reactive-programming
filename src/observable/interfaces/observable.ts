import { Handler } from '../types/handler';
import { Nullable } from '../types/nullable';
import { ListenProps } from './listenProps';
import { Subscription } from './subscription';

abstract class Observable<T = unknown> {
  abstract get value(): Nullable<T>;

  abstract set value(data: Nullable<T>);

  abstract add: Handler<Nullable<T>>;

  abstract addError: Handler<unknown>;

  abstract listen: Handler<
    Nullable<ListenProps<Nullable<T>>>,
    Subscription<Nullable<T>>
  >;

  abstract get length(): number;

  abstract get hasListeners(): boolean;

  abstract get isClosed(): boolean;

  abstract close: Handler<void, Promise<void>>;

  abstract toString: Handler<void, string>;
}

export type { Observable };
