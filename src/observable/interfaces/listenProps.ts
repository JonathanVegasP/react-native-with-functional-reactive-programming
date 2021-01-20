import { OnData } from '../types/onData';
import { OnDone } from '../types/onDone';
import { OnError } from '../types/onError';

interface ListenProps<T> {
  onData?: OnData<T>;
  onError?: OnError;
  onDone?: OnDone;
}

export type { ListenProps };
