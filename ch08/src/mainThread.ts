import { Worker } from 'node:worker_threads';

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

type SolverPromise = (...args: [unknown]) => Promise<unknown>;

function cleanup(worker: Worker) {
  worker.postMessage('cleanup');
}

function stop() {
  console.log("The main process has stopped");
  process.exit(0);
}

function createProtocol<P extends Protocol>(worker: Worker) {
  return <K extends keyof P>(command: K) => (...args: P[K]['in']) =>
    new Promise<P[K]['out']>((resolve, reject) => { 
      worker.on('error', reject);
      worker.on('message', event => resolve(event));
      worker.postMessage({command, args});
    })
}

function getProtocolTaskSolver<P extends Protocol>(
  worker: Worker,
  protocolCommand: keyof P 
): SolverPromise {
  let runWithMatrixProtocol = createProtocol<P>(worker);
  let solver = runWithMatrixProtocol(protocolCommand);
  return solver;
}

function run(solver: SolverPromise, ...args: [unknown]) {
  solver(...args)
    .then(value => console.log(value));
}

function main<P extends Protocol>(workerFilePath: string) {
  let worker = new Worker(
    new URL(workerFilePath, import.meta.url)
  );
  worker.once('exit', stop);

  process.on('SIGTERM', () => cleanup(worker));
  process.on('SIGINT', () => cleanup(worker));

  const solver = getProtocolTaskSolver<P>(worker, 'determinant');
  let mat = [
    [0, 4, -1],
    [0, 0, -2],
    [1, 2, -1]
  ];

  run(solver, mat);
}

main<MatrixProtocol>('./matrixWorker.js');
