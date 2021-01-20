import { ListenProps } from './listenProps';
import { Subscription } from './subscription';

interface SubscriptionParam<T> extends ListenProps<T> {
  subscriptions: Subscription<T>[];
}

export type { SubscriptionParam };
