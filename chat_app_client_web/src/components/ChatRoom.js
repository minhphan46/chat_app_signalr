import { Col, Row } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const ChatRoom = ({ userId, messages, sendMessage }) => (
  <div className="chat-room">
    {/* <Row className="px-5 py-4">
      <Col sm="12">
        <h1 className="font-weight-light text-center">Chat Room</h1>
      </Col>
    </Row> */}
    <main className="px-5 py-4">
      <Col sm="12" className="message-container-wrapper">
        <MessageContainer userId={userId} messages={messages} />
      </Col>
    </main>
    <Row className="px-5 py-4">
      <Col sm="12">
        <SendMessageForm sendMessage={sendMessage} />
      </Col>
    </Row>
  </div>
);

export default ChatRoom;
