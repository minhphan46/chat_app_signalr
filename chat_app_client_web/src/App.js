import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/WaitingRoom";
import ChatRoom from "./components/ChatRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

function App() {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatRoom) => {
    try {
      // initiate a connection
      const conn = new HubConnectionBuilder()
        .withUrl("https://upright-wealthy-walrus.ngrok-free.app/chat")
        .configureLogging(LogLevel.Information)
        .build();

      // set the connection
      conn.on("JoindSpecificChatRoom", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      conn.on("ReceiveSpecificMessage", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      await conn.start();
      await conn.invoke("JoindSpecificChatRoom", { username, chatRoom });

      setConnection(conn);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row class="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">Wellcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          {connection ? (
            <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
          ) : (
            <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
