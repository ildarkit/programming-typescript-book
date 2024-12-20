import { reserve } from './reserve';
import { call } from './call-poly';
import { is } from './type-cmp-lib'; 

function slice(
  start: number,
  source: string,
  end?: number
): string {
  return source.slice(start, end);
}

function main() {
  console.log(call(slice, 5, 'from origin string'));
  let value = 'string';
  let other = 'other string';
  console.log(`${value} and ${other} is equal: ${is(value, other)}`);
  let value1 = false;
  let other1 = true;
  console.log(`${value1} and ${other1} is equal: ${is(value1, other1)}`);
  let value2 = 10;
  let other2 = 'string';
  console.log(`${value2} and ${other2} is equal: ${is(value2, other2)}`);
}

main();
