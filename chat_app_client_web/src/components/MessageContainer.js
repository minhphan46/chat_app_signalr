import { Col } from "react-bootstrap";

const MessageContainer = ({ userId, messages }) => (
  <main>
    {messages.map((msg, index) => {
      const isSystemMessage = msg.userId === 0;
      const isCurrentUser = msg.userId === userId;

      const messageClass = isSystemMessage
        ? "system"
        : msg.userId === userId
        ? "sent"
        : "received";

      return (
        <>
          <div className={`message ${messageClass}`}>
            {!isSystemMessage && !isCurrentUser && (
              <Col xs="auto" className="message-avatar">
                <div className="avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              </Col>
            )}
            {!isSystemMessage && !isCurrentUser && (
              <div className="message-content">
                <div className="message-username">{msg.username}</div>
                <p>{msg.msg}</p>
              </div>
            )}
            {(isSystemMessage || isCurrentUser) && <p>{msg.msg}</p>}
          </div>
        </>
      );
    })}
  </main>
);

export default MessageContainer;
