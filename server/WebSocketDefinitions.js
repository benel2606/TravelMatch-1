module.exports = (io) => {
  let {
    getSocketIDByUserID,
    addMessageToConversation,
    getMessagesByParticipants,
    removeSocketIDBySocketID,
    removeSocketIDByUserID,
    getConversationByUser,
    updateSocketID,
  } = require("./utilities");

  io.on("connection", (client) => {
    console.log("User Connected");
    client.on("getMessages", (participants) => {
      let messageParticipants = JSON.parse(participants);
      const senderName = messageParticipants.senderName;
      const receiverName = messageParticipants.receiverName;
      client.emit(
        "receiveMessage",
        JSON.stringify(getMessagesByParticipants(senderName, receiverName))
      );
    });

    client.on("getConversationsByUser", (currentUser) => {
      let currentUserName = JSON.parse(currentUser);
      client.emit(
        "receiveConversations",
        JSON.stringify(getConversationByUser(currentUserName))
      );
    });

    client.on("sendMessage", (stringyMessageDetails) => {
      let messageDetails = JSON.parse(stringyMessageDetails);
      const senderName = messageDetails.senderName;
      const receiverName = messageDetails.receiverName;
      const receiverSocketID = getSocketIDByUserID(messageDetails.receiverID);
      addMessageToConversation(senderName, receiverName, messageDetails);

      io.to(client.id).emit(
        "receiveMessage",
        JSON.stringify(getMessagesByParticipants(senderName, receiverName))
      );
      io.to(client.id).emit(
        "receiveConversations",
        JSON.stringify(getConversationByUser(senderName))
      );

      if (receiverSocketID !== -1) {
        io.to(receiverSocketID).emit(
          "receiveMessage",
          JSON.stringify(getMessagesByParticipants(senderName, receiverName))
        );

        io.to(receiverSocketID).emit(
          "receiveConversations",
          JSON.stringify(getConversationByUser(receiverName))
        );
      }
    });

    client.on("newMatchInserted", () => {
      io.emit("displayNewMatches");
    });
    client.on("matchDeleted", () => {
      io.emit("displayNewMatches");
    });

    client.on("updateClientList", (userID) => {
      updateSocketID(userID, client.id);
    });
    client.on("removeFromClientList", (userID) => {
      removeSocketIDByUserID(userID);
    });

    client.on("disconnect", () => {
      console.log("User Disconnected");
      removeSocketIDBySocketID(client.id);
    });
  });
};
