import { reserve } from './reserve';
import { call } from './call-poly';

function slice(
  start: number,
  source: string,
  end?: number
): string {
  return source.slice(start, end);
}

function main() {
  console.log(call(slice, 5, 'from origin string'));
}

main();
