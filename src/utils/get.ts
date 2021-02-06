import { GetProps } from './interfaces/getProps';

const get = <T>({ object, path, defaultValue }: GetProps<T>) => {
  if (!path || !object) return defaultValue;

  const pathArray = Array.isArray(path) ? path : path.match(/[^\.\[\]]+/g);

  return (
    (pathArray?.reduce(
      (obj: Record<string, any>, key) => obj && obj[key],
      object,
    ) as T) || defaultValue
  );
};

export { get };
