import { EventEmitter } from 'node:events';
import { parentPort } from 'node:worker_threads';

type Matrix = number[][];

type MatrixProtocol = {
  determinant: {
    in: [Matrix]
    out: number
  }
  'dot-product': {
    in: [Matrix, Matrix]
    out: Matrix
  }
  invert: {
    in: [Matrix]
    out: Matrix
  }
};

type Protocol = {
  [command: string]: {
    in: unknown[]
    out: unknown
  }
};

function determinant(matrix: Matrix): number {
  const n = matrix.length;

  if (n === 1) {
    return matrix[0][0];
  } 

  let det = 0;
  let sign = 1;

  for (let i = 0; i < n; i++) {
    const subMatrix = matrix.slice(1)
      .map(row => row.filter((_, colIndex) => colIndex !== i));
    det += sign * matrix[0][i] * determinant(subMatrix);
    sign = -sign;
  }

  return det;
}

class SafeEmitter<P extends Protocol> {
  private emitter = new EventEmitter();
  emit<K extends keyof P>(
    channel: Exclude<K, number>,
    ...data: P[K]['in']
  ) {
    return this.emitter.emit(channel, ...data);
  }
  on<K extends keyof P>(
    channel: Exclude<K, number>,
    listener: (...data: P[K]['in']) => void
  ) {
    return this.emitter.on(channel, listener);
  }
}

function run() {
  let eventEmitter = new SafeEmitter<MatrixProtocol>();

  parentPort!.on('message', message => {
    if (message === 'cleanup') {
      console.log('\nThe worker has stopped');
      process.exit(0);
    }
    eventEmitter.emit(message.command, ...message.args);
  });

  eventEmitter.on('determinant', message => {
    let result = determinant(message);
    parentPort!.postMessage(result);
  });
}

run();
