import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/WaitingRoom";
import ChatRoom from "./components/ChatRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("");

  // generate random user id when component mounts
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 999999);
    setUserId(randomId);
  }, []);

  const joinChatRoom = async (username) => {
    try {
      setUsername(username);
      // initiate a connection
      const conn = new HubConnectionBuilder()
        .withUrl(
          // "https://app-chat-dev-001-czg2hthmanhxeycs.eastus-01.azurewebsites.net/chat"
          "http://localhost:5260/chat"
        )
        .configureLogging(LogLevel.Information)
        .build();

      // setup connection listeners
      conn.on("ReceiveMessage", (res) => {
        try {
          // Assume the response object has userName, messageText properties
          const messageObj = res;

          console.log("Message received: ", messageObj);

          // Destructure the actual properties from the object
          const {
            userId,
            userName: username,
            messageText: msg,
            createDate: time,
          } = messageObj;

          // Append new message to the state
          setMessages((prevMessages) => [
            ...prevMessages,
            { userId, username, msg, time },
          ]);
        } catch (error) {
          console.error("Error parsing message: ", error, res);
        }
      });

      // start the connection
      await conn.start();
      await conn.invoke("JoinUser", username, userId);

      // set the connection state
      setConnection(conn);
    } catch (error) {
      console.error("Connection error: ", error);
    }
  };

  const sendMessage = async (messageText) => {
    try {
      if (connection) {
        await connection.invoke(
          "SendUserMessage",
          username,
          userId,
          messageText
        );
      } else {
        console.error("No connection to server.");
      }
    } catch (error) {
      console.error("Send message error: ", error);
    }
  };

  const leaveChatRoom = async () => {
    try {
      if (connection) {
        await connection.stop();
        setConnection(null);
      }
    } catch (error) {
      console.error("Leave chat room error: ", error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Chat App💬</h1>
        {connection && <SignOut logout={leaveChatRoom} />}
      </header>

      <section>
        {connection ? (
          <ChatRoom
            userId={userId}
            messages={messages}
            sendMessage={sendMessage}
          ></ChatRoom>
        ) : (
          <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
        )}
      </section>
    </div>
  );
}

export default App;

function SignOut({ logout }) {
  return (
    <button className="sign-out" onClick={() => logout()}>
      Out
    </button>
  );
}
