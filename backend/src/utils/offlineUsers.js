let offlineUsers = [];

const getOfflineUsers = () => offlineUsers;

const addOfflineUser = (user) => {
  offlineUsers.push(user);
  return user;
};

const findOfflineUser = (id) => offlineUsers.find(u => u._id === id);

const findOfflineUserByEmail = (email) => offlineUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

module.exports = {
  getOfflineUsers,
  addOfflineUser,
  findOfflineUser,
  findOfflineUserByEmail
};