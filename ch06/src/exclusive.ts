type Exclusive<T, U> = (T extends (U & T) ? never : T) |
  (U extends (U & T) ? never : U);
type E = Exclusive<1 | 2, 2 | 4>;

let a: E = 4;
let b: E = 1;
let c: E = 2;
let d: E = 3;
