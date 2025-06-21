const Storage = {
  setUser(username) {
    localStorage.setItem('loginUser', username);
  },
  getUser() {
    return localStorage.getItem('loginUser');
  },
  clearUser() {
    localStorage.removeItem('loginUser');
  }
};
