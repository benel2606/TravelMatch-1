import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { socket } from "../../api";
import { Link } from "react-router-dom";
import "./WaitingMessages.css";

const WaitingMessages = ({ closeModal, currentUsername, ...props }) => {
  Modal.setAppElement("#root");
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    socket.emit("getConversationsByUser", JSON.stringify(currentUsername));

    socket.on("receiveConversations", (receiverConversations) => {
      setConversations(JSON.parse(receiverConversations));
    });
    return () => {
      socket.off("receiveConversations");
    };
  }, [currentUsername]);

  const createConversationList = () => {
    const conversationList = conversations.map((conversation, index) => {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      const lastMessageDate = new Date(lastMessage.date);
      const date =
        lastMessageDate.getDate() +
        "/" +
        (lastMessageDate.getMonth() + 1) +
        "/" +
        lastMessageDate.getFullYear() +
        " @ " +
        lastMessageDate.getHours() +
        ":" +
        lastMessageDate.getMinutes() +
        ":" +
        lastMessageDate.getSeconds();

      let username;
      let userID;

      if (lastMessage.receiverName === currentUsername) {
        username = lastMessage.senderName;
        userID = lastMessage.senderID;
      } else {
        username = lastMessage.receiverName;
        userID = lastMessage.receiverID;
      }

      return (
        <div key={index} className="ui segment waiting-message">
          <Link
            to={{
              pathname: `/Chat/${userID}&${username}`,
            }}
            onClick={() => closeModal()}
          >
            <div className="ui feed">
              <div className="event">
                <div className="content">
                  <div className="date">{date}</div>
                  <div className="summary">
                    {lastMessage.senderName === currentUsername ? (
                      <span>
                        You sent a message to{" "}
                        <span className="ui black basic label">
                          {lastMessage.receiverName}
                        </span>
                      </span>
                    ) : (
                      <span>
                        <span className="ui black basic label">
                          {lastMessage.senderName}
                        </span>
                        <span>sent you a message</span>
                      </span>
                    )}
                  </div>
                  <div className="extra text">{lastMessage.text}</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });

    return (
      <div className="ui feed">
        {conversations.length === 0 ? null : conversationList}
      </div>
    );
  };
  return (
    <Modal {...props} className="modal">
      <div className="modal-div">{createConversationList()}</div>
    </Modal>
  );
};

export default WaitingMessages;
