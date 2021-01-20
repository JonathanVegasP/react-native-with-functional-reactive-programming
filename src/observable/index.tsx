import React, { FC, useEffect, useMemo, useState } from 'react';
import { forEach } from '../utils/forEach';
import { map } from '../utils/map';
import { remove } from '../utils/remove';
import { ObservableException } from './exceptions/observableException';
import { ListenProps } from './interfaces/listenProps';
import { Observable } from './interfaces/observable';
import { ObxProps } from './interfaces/obxProps';
import { Subscription } from './interfaces/subscription';
import { SubscriptionParam } from './interfaces/subscriptionProps';
import { ContextFactoryHandler } from './types/contextFactoryHandler';
import { Handler } from './types/handler';
import { Nullable } from './types/nullable';
import { ObservableFactoryHandler } from './types/observableFactoryHandler';
import { OnData } from './types/onData';
import { OnDone } from './types/onDone';
import { OnError } from './types/onError';
import { UseObservableHandler } from './types/useObservableHandler';

class _Subscription<T> implements Subscription<T> {
  private _subscriptions: Nullable<Subscription<T>[]>;
  private _onData: Nullable<OnData<T>>;
  private _onError: Nullable<OnError>;
  private _onDone: Nullable<OnDone>;
  private _isPaused = false;

  constructor(props: SubscriptionParam<T>) {
    for (let k in props) {
      const key = `_${k}`;

      (this as any)[key] = props[k as keyof typeof props];
    }
  }

  triggerData = (data: T) => this._onData?.call(this, data);

  triggerError = (error: unknown) => this._onError?.call(this, error);

  triggerDone = () => {
    this._onDone?.call(this);

    this._subscriptions = null;
    this._onData = null;
    this._onError = null;
    this._onDone = null;
  };

  onData: Handler<Nullable<OnData<T>>, void> = (handler) =>
    (this._onData = handler);

  onError: Handler<Nullable<OnError>, void> = (handler) =>
    (this._onError = handler);

  onDone: Handler<Nullable<OnDone>, void> = (handler) =>
    (this._onDone = handler);

  get isPaused(): boolean {
    return this._isPaused;
  }

  pause: Handler<void, void> = () => (this._isPaused = true);

  resume: Handler<void, void> = () => (this._isPaused = false);

  cancel: Handler<void, void> = () => {
    remove({
      array: this._subscriptions!,
      predicate: ({ value }) => value === this,
    });

    this.triggerDone();
  };
}

class _MergedSubscription<T> implements Subscription<T> {
  private _subscriptions: _Subscription<T>[];

  constructor(subscriptions: Subscription<T>[]) {
    this._subscriptions = subscriptions as any;
  }

  triggerData = (data: T) =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.triggerData(data),
    });

  triggerError = (error: unknown) =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.triggerError(error),
    });

  triggerDone = () =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.triggerDone(),
    });

  onData: Handler<Nullable<OnData<T>>, void> = (handler) =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.onData(handler),
    });

  onError: Handler<Nullable<OnError>, void> = (handler) =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.onError(handler),
    });

  onDone: Handler<Nullable<OnDone>, void> = (handler) =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.onDone(handler),
    });

  get isPaused(): boolean {
    throw new Error('Method not implemented.');
  }

  pause: Handler<void, void> = () =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.pause(),
    });

  resume: Handler<void, void> = () =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.resume(),
    });

  cancel: Handler<void, void> = () =>
    forEach({
      array: this._subscriptions,
      predicate: ({ value }) => value.cancel(),
    });
}

class _ObservableContext {
  private _observables: Nullable<Set<Observable>>;

  track = () => (this._observables = new Set());

  reportRead = (obs: Observable) => this._observables?.add(obs);

  unTrack = (): Observable => {
    if (!this._observables!.size) {
      throw new ObservableException(false, true);
    }

    const obs =
      this._observables!.size === 1
        ? this._observables!.values().next().value
        : new _MergedObservable([...this._observables!]);

    this._observables = null;

    return obs;
  };
}

const _context = new _ObservableContext();

class _Observable<T> implements Observable<T> {
  private _subscriptions: Nullable<_Subscription<Nullable<T>>[]> = [];
  private _value: Nullable<T>;
  private _isClosed = false;

  constructor(initialValue?: Nullable<T>) {
    this._value = initialValue;
  }

  private _isAlreadyClosed(close = false) {
    if (this._isClosed) {
      throw new ObservableException(close);
    }
  }

  get value(): Nullable<T> {
    _context.reportRead(this as Observable);
    return this._value;
  }

  set value(data: Nullable<T>) {
    this.add(data);
  }

  add: Handler<Nullable<T>, void> = (data) => {
    this._isAlreadyClosed();

    this._value = data;

    setTimeout(() => {
      forEach({
        array: this._subscriptions!,
        predicate: ({ value }) => {
          if (value.isPaused) return;

          try {
            value.triggerData(data);
          } catch (error) {
            value.triggerError(error);
          }
        },
      });
    }, 0);
  };

  addError: Handler<unknown, void> = (error) => {
    this._isAlreadyClosed();

    setTimeout(() => {
      forEach({
        array: this._subscriptions!,
        predicate: ({ value }) => {
          if (value.isPaused) return;

          value.triggerError(error);
        },
      });
    }, 0);
  };

  listen: Handler<
    Nullable<ListenProps<Nullable<T>>>,
    Subscription<Nullable<T>>
  > = (props) => {
    this._isAlreadyClosed();

    const subs: Subscription<Nullable<T>> = new _Subscription({
      ...(props || {}),
      subscriptions: this._subscriptions!,
    });

    this._subscriptions!.push(subs as _Subscription<Nullable<T>>);

    return subs;
  };

  get length(): number {
    return this._subscriptions?.length || 0;
  }

  get hasListeners(): boolean {
    return this.length > 0;
  }

  get isClosed(): boolean {
    return this._isClosed;
  }

  close: Handler<void, Promise<void>> = () => {
    this._isAlreadyClosed(true);

    this._isClosed = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        forEach({
          array: this._subscriptions!,
          predicate: ({ value }) => value.triggerDone(),
        });

        this._subscriptions = null;
        this._value = null;

        resolve();
      }, 0);
    });
  };

  toString: Handler<void, string> = () => `${this.value}`;
}

class _MergedObservable<T = unknown> implements Observable<T> {
  private _observables: Observable<T>[];

  constructor(observables: Observable<T>[]) {
    this._observables = observables;
  }

  get value(): Nullable<T> {
    throw new Error('Method not implemented.');
  }

  set value(data: Nullable<T>) {
    this.add(data);
  }

  add: Handler<Nullable<T>, void> = (data) =>
    forEach({
      array: this._observables,
      predicate: ({ value }) => value.add(data),
    });

  addError: Handler<unknown, void> = (error) =>
    forEach({
      array: this._observables,
      predicate: ({ value }) => value.addError(error),
    });

  listen: Handler<
    Nullable<ListenProps<Nullable<T>>>,
    Subscription<Nullable<T>>
  > = (props) => {
    const subs: Subscription<Nullable<T>>[] = [];

    forEach({
      array: this._observables,
      predicate: ({ value }) => {
        subs.push(value.listen(props));
      },
    });

    return new _MergedSubscription(subs);
  };

  get length(): number {
    return this._observables.length;
  }

  get hasListeners(): boolean {
    throw new Error('Method not implemented.');
  }

  get isClosed(): boolean {
    throw new Error('Method not implemented.');
  }

  close: Handler<void, Promise<void>> = () =>
    Promise.all(
      map({
        array: this._observables,
        predicate: ({ value }) => value.close(),
      }),
    ) as any;

  toString: Handler<void, string> = () => 'MergedObservable';
}

const ObservableFactory: ObservableFactoryHandler = (initialValue) =>
  new _Observable(initialValue);

const useMethodExtensions = () => {
  Object.defineProperty(Object.prototype, 'obs', {
    configurable: true,
    enumerable: false,
    get: function () {
      return new _Observable(this);
    },
  });
};

const useObservable: UseObservableHandler = (initialValue) =>
  useMemo(() => ObservableFactory(initialValue), []);

const Obx: FC<ObxProps> = React.memo(
  ({ children }) => {
    _context.track();
    const component = children();
    const obs = _context.unTrack();

    const [, setState] = useState<unknown>();

    useEffect(() => {
      const subs = obs.listen({
        onData: (data) => setState(data),
      });

      return () => subs.cancel();
    }, [children]);

    return component;
  },
  (prev, actual) => prev.children === actual.children,
);

const runAndListen = <T,>(fn: Handler<T | null>) => {
  _context.track();
  fn(null);
  const subs = _context.unTrack().listen({ onData: fn as Handler<unknown> });

  const dispose = () => subs.cancel();

  return dispose;
};

const ContextFactory: ContextFactoryHandler = (initialState, actions) => {
  const obs = ObservableFactory(initialState);

  const useContext = (listen = true) => {
    if (!listen) {
      return (obs as any)._value;
    }

    const { _value } = obs as any;

    const [state, setState] = useState(_value);

    useEffect(() => {
      const subs = obs.listen({ onData: (data) => setState(data!) });

      return () => subs.cancel();
    }, []);

    return state;
  };

  const newActions = {} as any;

  for (let k in actions) {
    newActions[k] = actions[k]({
      setState: (fn) => {
        const { _value } = obs as any;
        obs.add(fn(_value));
      },
    });
  }

  const useContextActions = () => newActions;

  return { useContext, useContextActions };
};

export {
  ObservableFactory,
  useMethodExtensions,
  useObservable,
  Obx,
  runAndListen,
  ContextFactory,
};
