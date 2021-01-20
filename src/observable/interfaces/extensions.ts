import { Observable } from './observable';

declare global {
  export interface Object {
    obs: Observable<Object>;
  }

  export interface BigInt {
    obs: Observable<BigInt>;
  }

  export interface Boolean {
    obs: Observable<boolean>;
  }

  export interface Function {
    obs: Observable<Function>;
  }

  export interface Number {
    obs: Observable<number>;
  }

  export interface String {
    obs: Observable<string>;
  }

  export interface Symbol {
    obs: Observable<Symbol>;
  }

  export interface Array<T> {
    obs: Observable<Array<T>>;
  }

  export interface Set<T> {
    obs: Observable<Set<T>>;
  }

  export interface WeakSet<T> {
    obs: Observable<WeakSet<T>>;
  }

  export interface Map<K, V> {
    obs: Observable<Map<K, V>>;
  }

  export interface WeakMap<K, V> {
    obs: Observable<WeakMap<K, V>>;
  }

  export interface Date {
    obs: Observable<Date>;
  }

  export interface Promise<T> {
    obs: Observable<Promise<T>>;
  }

  export interface RegExp {
    obs: Observable<RegExp>;
  }

  export interface Error {
    obs: Observable<Error>;
  }
}
