import EventEmitter from 'node:events';
import { parentPort } from 'node:worker_threads';

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

class SafeEmitter<
  Events extends Record<PropertyKey, unknown[]>
> {
  private emitter = new EventEmitter();
  emit<K extends keyof Events>(
    channel: Exclude<K, number>,
    ...data: Events[K] 
  ) {
    return this.emitter.emit(channel, data);
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

parentPort!.on('message', command => {
  if (command === 'cleanup') {
    console.log('\nThe worker has stopped');
    process.exit(0);
  }
  commandEmitter.emit(
    command.type, ...command.data
  );
});

eventEmitter.on('receivedMessage', data =>
  parentPort!.postMessage({type: 'receivedMessage', data})
);
eventEmitter.on('createdThread', data =>
  parentPort!.postMessage({type: 'createdThread', data})
);
eventEmitter.on('addedUserToThread', data =>
  parentPort!.postMessage({type: 'addedUserToThread', data})
);
eventEmitter.on('removedUserFromThread', data =>
  parentPort!.postMessage({type: 'removedUserFromThread', data})
);

commandEmitter.on('sendMessageToThread', (threadID, message) =>
  console.log(`OK, I will send a message to threadID ${threadID}`)
);
commandEmitter.on('createThread', (participants) =>
  console.log(`OK, thread created with participants`, participants)
);

commandEmitter.on('addUserToThread', (threadID, userID) =>
  console.log(`OK, user ${userID} added to the thread ${threadID}`)
);

commandEmitter.on('removeUserFromThread', (threadID, userID) =>
  console.log(`Ok, user ${userID} removed from thread ${threadID}`)
);
eventEmitter.emit('createdThread', 1234, [456, 789]);
