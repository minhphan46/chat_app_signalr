import { Col, Row } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const chatRoom = ({ userId, messages, sendMessage }) => (
  <div>
    <Row className="px-5 py-5">
      <Col sm="12">
        <h1 className="font-weight-light">Chat Room</h1>
      </Col>
      <Col sm="12"></Col>
    </Row>
    <Row className="px-5 py-5">
      <Col sm="12">
        <MessageContainer userId={userId} messages={messages} />
      </Col>
      <Col sm="12">
        <SendMessageForm sendMessage={sendMessage} />
      </Col>
    </Row>
  </div>
);

export default chatRoom;
