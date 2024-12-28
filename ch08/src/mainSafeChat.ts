import EventEmitter from 'node:events';
import { Worker } from 'node:worker_threads';

type Message = string;
type ThreadID = number;
type UserID = number;
type Participants = UserID[];

type Commands = {
  sendMessageToThread: [ThreadID, Message]
  createThread: [Participants]
  addUserToThread: [ThreadID, UserID]
  removeUserFromThread: [ThreadID, UserID]
};

type Events = {
  receivedMessage: [ThreadID, UserID, Message]
  createdThread: [ThreadID, Participants]
  addedUserToThread: [ThreadID, UserID]
  removedUserFromThread: [ThreadID, UserID]
};

function cleanup(worker: Worker) {
  worker.postMessage('cleanup');
}

function stop() {
  console.log("The main process has stopped");
  process.exit(0);
}

class SafeEmitter<
  Events extends Record<PropertyKey, unknown[]>
> {
  private emitter = new EventEmitter();
  emit<K extends keyof Events>(
    channel: Exclude<K, number>,
    ...data: Events[K] 
  ) {
    return this.emitter.emit(channel, ...data);
  }
  on<K extends keyof Events>(
    channel: Exclude<K, number>,
    listener: (...data: Events[K]) => void
  ) {
    return this.emitter.on(channel, listener);
  }
}

let commandEmitter = new SafeEmitter<Commands>();
let eventEmitter = new SafeEmitter<Events>();

let worker = new Worker(
  new URL('./workerSafeChat.js', import.meta.url)
);
worker.once('exit', stop);

process.on('SIGTERM', () => cleanup(worker));
process.on('SIGINT', () => cleanup(worker));

worker.on('message', event => { 
  eventEmitter.emit(
    event.type, ...event.data
  );
});

commandEmitter.on('sendMessageToThread', data =>
  worker.postMessage({type: 'sendMessageToThread', data})
);
commandEmitter.on('createThread', data =>
  worker.postMessage({type: 'createThread', data})
);
commandEmitter.on('addUserToThread', data =>
  worker.postMessage({type: 'addUserToThread', data})
);
commandEmitter.on('removeUserFromThread', data =>
  worker.postMessage({type: 'removeUserFromThread', data})
);

eventEmitter.on('createdThread', (threadID, participants) =>
  console.log('Created a new chat thread!', threadID, participants)
);
eventEmitter.on('receivedMessage', (threadID, userId, message) =>
  console.log('Received message!', threadID, userId, message)
);
eventEmitter.on('addedUserToThread', (threadID, userId) =>
  console.log('User was added to the thread', threadID, userId)
);
eventEmitter.on('removedUserFromThread', (threadID, userId) =>
  console.log('User was removed from thread', threadID, userId)
);

commandEmitter.emit('createThread', [123, 456]);
