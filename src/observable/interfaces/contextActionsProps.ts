import { Handler } from '../types/handler';

interface ContextActionsProps<T> {
  setState: Handler<Handler<T, T>, T>;
}

export type { ContextActionsProps };
