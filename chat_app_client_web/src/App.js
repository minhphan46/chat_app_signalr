import { Container, Row, Col } from "react-bootstrap";
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
        .withUrl("https://upright-wealthy-walrus.ngrok-free.app/chat")
        .configureLogging(LogLevel.Information)
        .build();

      // setup connection listeners
      conn.on("ReceiveMessage", (res) => {
        try {
          // Assume the response object has userName, messageText properties
          const messageObj = res;

          console.log("Message received: ", messageObj);

          // Destructure the actual properties from the object
          const { userId, userName: username, messageText: msg } = messageObj;

          // Append new message to the state
          setMessages((prevMessages) => [
            ...prevMessages,
            { userId, username, msg },
          ]);
        } catch (error) {
          console.error("Error parsing message: ", error, res);
        }
      });

      // start the connection
      await conn.start();
      await conn.invoke("JoinUSer", username, userId);

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

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">Welcome to the ChatApp</h1>
            </Col>
          </Row>
          {connection ? (
            <ChatRoom
              userId={userId}
              messages={messages}
              sendMessage={sendMessage}
            ></ChatRoom>
          ) : (
            <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
