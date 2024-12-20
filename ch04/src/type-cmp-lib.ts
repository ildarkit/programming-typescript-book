type Comparable<T> = [T, ...T[]];

export function is<T>(...args: Comparable<T>): boolean {
  return args.every(a => a === args[0]);
};
