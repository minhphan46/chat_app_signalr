import { Col, Row } from "react-bootstrap";
import "../styles/MessageContainer.css"; // Import file CSS để định dạng

const MessageContainer = ({ userId, messages }) => (
  <div className="message-container">
    {messages.map((msg, index) => {
      const isSystemMessage = msg.userId === 0;
      const isCurrentUser = msg.userId === userId;

      return (
        <Row
          key={index}
          className={`message-row ${
            isSystemMessage
              ? "system-message"
              : isCurrentUser
              ? "current-user"
              : "other-user"
          }`}
          noGutters
        >
          {!isSystemMessage && !isCurrentUser && (
            <Col xs="auto" className="message-avatar">
              <div className="avatar">
                {msg.username.charAt(0).toUpperCase()}
              </div>
            </Col>
          )}
          <Col
            className={`message-bubble ${isCurrentUser ? "align-right" : ""}`}
          >
            <div className="message-content">
              {!isSystemMessage && <strong>{msg.username}</strong>}
              <p>{msg.msg}</p>
            </div>
          </Col>
        </Row>
      );
    })}
  </div>
);

export default MessageContainer;
