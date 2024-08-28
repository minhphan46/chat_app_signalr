import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/WaitingRoom";
import ChatRoom from "./components/ChatRoom";
import SignOut from "./components/SignOut";
import { Form } from "react-bootstrap";
import {
  joinPublicChatRoom,
  joinPrivateChatRoom,
  sendMessage,
  leaveChatRoom,
} from "./services/ChatService";
import { generateKeyAsync } from "./services/E2EEService";

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 999999);
    setUserId(randomId);
  }, []);

  const handlePrivateToggle = () => {
    setIsPrivate(!isPrivate);
  };

  const joinChatRoom = async (username, roomId = "") => {
    if (isPrivate) {
      await joinPrivateChatRoom(
        username,
        roomId,
        setUsername,
        setRoomId,
        setMessages,
        setConnection,
        userId,
        publicKey,
        setSecret
      );
    } else {
      await joinPublicChatRoom(
        username,
        setUsername,
        setRoomId,
        setMessages,
        setConnection,
        userId,
        roomId
      );
    }
  };

  const [publicKey, setPublicKey] = useState(null);
  const [secret, setSecret] = useState("");

  useEffect(() => {
    // generateKey
    generateKeyAsync(setPublicKey);
  }, []);

  return (
    <div className="App">
      <header>
        {!connection && <h1>Chat App💬</h1>}
        {connection && <h1>{isPrivate ? `Room ${roomId}` : "Public Chat"}</h1>}
        {!connection && (
          <Form.Check
            type="switch"
            id="private-chat-switch"
            label={isPrivate ? "Private Chat" : "Public Chat"}
            checked={isPrivate}
            onChange={handlePrivateToggle}
          />
        )}
        {connection && (
          <SignOut
            logout={() => leaveChatRoom(connection, setConnection, setMessages)}
          />
        )}
      </header>

      <section>
        {connection ? (
          <ChatRoom
            userId={userId}
            messages={messages}
            sendMessage={(messageText) =>
              sendMessage(
                connection,
                isPrivate,
                username,
                userId,
                messageText,
                roomId,
                secret
              )
            }
          />
        ) : (
          <WaitingRoom joinChatRoom={joinChatRoom} isPrivate={isPrivate} />
        )}
      </section>
    </div>
  );
}

export default App;
