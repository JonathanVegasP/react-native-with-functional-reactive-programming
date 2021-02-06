import { ContextActionsProps } from '../interfaces/contextActionsProps';
import { Handler } from './handler';

type ContextFactoryHandler = <T, R = Record<string, (...args: any[]) => any>>(
  initialState: T,
  actions: Record<
    string,
    Handler<ContextActionsProps<T>, (...args: any[]) => any>
  >,
) => {
  useContext: (listen?: boolean) => T;
  useContextActions: () => R;
};

export type { ContextFactoryHandler };
