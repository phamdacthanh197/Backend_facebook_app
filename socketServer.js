let users = [];

const SocketServer = (socket) => {
  //#region //!Connection
  socket.on('joinUser', (id) => {
    console.log("server on join", id)
    if(!users.some(user =>user.id === id )){
      users.push({ id, socketId: socket.id });
    }
    console.log(users)
  });

  socket.on('disconnect', () => {
    console.log("disconnect")
    users = users.filter((user) => user.socketId !== socket.id);
  });
  //#endregion

  //#region //!Like
  socket.on('likePost', (newPost) => {
    let ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('likeToClient', newPost);
      });
    }
  });

  socket.on('unLikePost', (newPost) => {
    let ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('unLikeToClient', newPost);
      });
    }
  });
  //#endregion

  //#region //!comment
  socket.on('createComment', (newPost) => {
    let ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('createCommentToClient', newPost);
      });
    }
  });

  socket.on('deleteComment', (newPost) => {
    let ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost);
      });
    }
  });
  //#endregion

  //#region //!add and remove friend

  socket.on('toggleFriend', (newUser) => {
    console.log(newUser)
    const user = users.find((user) => user.id === newUser.updateFriends._id);
    user && socket.to(`${user.socketId}`).emit('toggleFriendForClient', newUser);
  });

  //#endregion
  //#region //!Notifications

  socket.on('createNotify', (msg) => {
    console.log(msg)
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
      });
    }
  });

  socket.on('removeNotify', (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg);
      });
    }
  });

  //#endregion

  //#region //!Messages

  socket.on('addMessage', (msg) => {
    const user = users.find((user) => user.id === msg.recipient._id);
    console.log(msg)
    console.log(user)
    console.log("present user",user)
    user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg);
  });

  //#endregion
};

export default SocketServer;
