type User = {
  id: string
} | {};
let user: User = {};
let globalCache = new Map();

fetchUser();
upperCaseUser(user);

function upperCaseUser(user: User) {
  if (!('id' in user)) return;
  console.log(user.id.toUpperCase());
}

function fetchUser() { 
  user = globalCache.get('user');
}
