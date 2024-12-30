interface IUser {
  name: string;
  age: number;
}

class User implements IUser {
  constructor(public name: string, public age: number) {}

  greet() {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`
    );
  }
}

namespace User {
  export const defaultUser: IUser = {
    name: "Default User",
    age: 30
  };

  export function createUser(name: string, age: number): User {
    return new User(name, age);
  }

  export function getDefaultUser(): User {
    return new User(
      defaultUser.name,
      defaultUser.age
    );
  }
}

const user1 = new User("Alice", 25);
user1.greet();
const user2 = User.createUser("Bob", 28);
user2.greet(); 
const defaultUser = User.getDefaultUser();
defaultUser.greet(); 
