interface Result<T, E> { 
  map<U>(
    f: (_: T | never) => Result<U, E>
  ): Result<U, E>
  unwrap(): T | never
  getOrElse<U>(value: U): T | U
}

class Ok<T> implements Result<T, never> {
  constructor(private value: T) {}

  map<U>(
    f: (value: T) => Result<U, never>
  ): Result<U, never> {
    return f(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  getOrElse(): T {
    return this.value;
  }
}

class Err<E> implements Result<never, E> {
  constructor(private error: E) {}

  map(
    f: (_: never) => Result<never, E>
  ): Result<never, E> {
    return this;
  }

  unwrap(): never {
    throw this.error;
  }

  getOrElse<U>(value: U): U {
    return value;
  }
}

function runTest() {
  type User = {
    id: string,
    name: string,
    password: string,
    friends: User[]
  };

  class ApiError extends Error {}
  class AuthorizationError extends ApiError {}
  class UserError extends ApiError {}

  type LoginResult = Result<User, ApiError | AuthorizationError>;
  type ApiResult<T> = Result<T, UserError | AuthorizationError>;
  type UserResult<T> = ApiResult<T>;

  interface AuthApi {
    getLoggedInUser(): LoginResult 
  }

  interface UserApi {
    getFriends(user: User): ApiResult<readonly User[]>
    getUserName(user: User): UserResult<string>
  }

  class Login implements AuthApi {
    getLoggedInUser(): LoginResult {
      return authResult;
    }
  }

  class UserState implements UserApi {
    getFriends(user: User): ApiResult<readonly User[]> {
      return friendsResult;
    }
    getUserName(user: User): UserResult<string> {
      return userResult;
    }
  }

  let user1!: User;
  let user2!: User;
  
  const user: User = { 
    id: '1',
    name: 'User1',
    password: 'password1',
    friends: [user1, user2] as const
  };
  user1 = {
    id: '2',
    name: 'User2',
    password: 'password2',
    friends: [user] as const
  };
  user2 = {
    id: '3',
    name: 'User3',
    password: 'password3',
    friends: [] as const
  };

  let authResult: LoginResult = new Ok(user);
  let login = new Login();

  let userState = new UserState();
  let friendsResult = new Ok(user.friends);
  let userResult = new Ok(user.name);

  const friends = login
    .getLoggedInUser()
    .map(user => userState.getFriends(user)) 
    .getOrElse([]);
  console.log(
    `test: friends is equal = ${friends === friendsResult.unwrap()}`
  );

  const userName = login
    .getLoggedInUser()
    .map(user => userState.getUserName(user)) 
    .unwrap();
  console.log(
    `test: userName is equal = ${user.name === userName}`
  );

  authResult = new Err(new Error('Unauthorized error'));
  const anonymous = login
    .getLoggedInUser()
    .getOrElse({});
  console.log(`test: user is anonymous = ${!('id' in anonymous)}`);

  try {
    login.getLoggedInUser().unwrap();
  } catch (e) {
    const error = e as Error;
    console.log(`test: catch error = '${error.message}'`);
  }
}

runTest();
