import { readFile } from 'node:fs';

function promisify<T, U>(
  f: (
    arg: T,
    cb: (err: Error | null, value: U | null) => void
  ) => void
) {
  return function (arg: T): Promise<U | null> {
    return new Promise((resolve, reject) => {
      f(arg, (err, value) => {
        if (err) return reject(err);
        resolve(value);
      });
    });
  }
}

const readFilePromise = promisify(readFile);
readFilePromise('src/promisify.ts')
  .then(data => {
    if (data)
      console.log(data.toString());
  })
  .catch(err => console.error(err.message));
