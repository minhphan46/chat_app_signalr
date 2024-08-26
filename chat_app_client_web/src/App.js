import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/WaitingRoom";
import ChatRoom from "./components/ChatRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import SignOut from "./components/SignOut";
import { API_CHAT_URL, API_GET_MESSAGES_URL } from "./constants/ApiUrl";
import axios from "axios";

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
        .withUrl(API_CHAT_URL)
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
        setMessages([]);
      }
    } catch (error) {
      console.error("Leave chat room error: ", error);
    }
  };

  const fetchOldMessages = async () => {
    try {
      const response = await axios.get(API_GET_MESSAGES_URL);
      const oldMessages = response.data;

      oldMessages.forEach((messageObj) => {
        // Destructure the actual properties from the object
        const {
          userId,
          userName: username,
          messageText: msg,
          createDate: time,
        } = messageObj;

        // Append new message to the state
        setMessages((prevMessages) => [
          { userId, username, msg, time },
          ...prevMessages,
        ]);
      });
    } catch (error) {
      console.error("Error fetching old messages: ", error);
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
            fetchOldMessages={fetchOldMessages}
          ></ChatRoom>
        ) : (
          <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
        )}
      </section>
    </div>
  );
}

export default App;
