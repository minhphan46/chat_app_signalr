import React from "react";
import { Col } from "react-bootstrap";

const getColorForUsername = (username) => {
  if (!colorMap.has(username)) {
    // Generate a random color
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colorMap.set(username, color);
  }
  return colorMap.get(username);
};

const colorMap = new Map();

const MessageContainer = ({ userId, messages }) => (
  <main>
    {messages.map((msg, index) => {
      const isSystemMessage = msg.userId === 0;
      const isCurrentUser = msg.userId === userId;

      const messageClass = isSystemMessage
        ? "system"
        : isCurrentUser
        ? "sent"
        : "received";

      // Generate color for username
      const avatarColor = getColorForUsername(msg.username);

      return (
        <div key={index} className={`message ${messageClass}`}>
          {!isSystemMessage && !isCurrentUser && (
            <Col xs="auto" className="message-avatar">
              <div className="avatar" style={{ backgroundColor: avatarColor }}>
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
      );
    })}
  </main>
);

export default MessageContainer;
