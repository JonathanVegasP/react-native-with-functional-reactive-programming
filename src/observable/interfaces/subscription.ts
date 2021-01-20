import { Handler } from '../types/handler';
import { Nullable } from '../types/nullable';
import { OnData } from '../types/onData';
import { OnDone } from '../types/onDone';
import { OnError } from '../types/onError';

abstract class Subscription<T> {
  abstract onData: Handler<Nullable<OnData<T>>>;

  abstract onError: Handler<Nullable<OnError>>;

  abstract onDone: Handler<Nullable<OnDone>>;

  abstract get isPaused(): boolean;

  abstract pause: Handler;

  abstract resume: Handler;

  abstract cancel: Handler;
}

export type { Subscription };
