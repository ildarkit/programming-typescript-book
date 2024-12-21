class MessageQueue {
  protected constructor(private messages: string[]) {}
}

// extending is possible
class BadQueue extends MessageQueue {}

function main() {
  // error: constructor of class is protected
  //let queue = new BadQueue();
}

main();
