interface GetProps<T> {
  object: Record<string, any> | any[];
  path: string | string[];
  defaultValue: T;
}

export type { GetProps };
