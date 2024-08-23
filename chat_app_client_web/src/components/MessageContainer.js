import React from "react";
import { Col } from "react-bootstrap";
import { getColorForUsername } from "../utils/avatar_color_util";
import { formatTime } from "../utils/time_util";

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

      // Parse message content from JSON string
      let textContent = null;
      let imageContent = null;

      try {
        const parsedMsg = JSON.parse(msg.msg);
        textContent = parsedMsg.text;
        imageContent = parsedMsg.image;
      } catch (error) {
        textContent = msg.msg;
      }

      return (
        <div key={index} className={`message ${messageClass}`}>
          {!isSystemMessage && !isCurrentUser && (
            <Col xs="auto" className="message-avatar">
              <div className="avatar" style={{ backgroundColor: avatarColor }}>
                {msg.username.charAt(0).toUpperCase()}
              </div>
            </Col>
          )}
          {isSystemMessage && textContent && <p>{textContent}</p>}

          {!isSystemMessage && (
            <div className={`message-content ${messageClass}`}>
              {!isCurrentUser && (
                <div className="message-username">{msg.username}</div>
              )}
              {imageContent && (
                <div className="image-container">
                  <img
                    src={imageContent}
                    alt="Message"
                    className="message-image"
                  />
                </div>
              )}
              {textContent && <p>{textContent}</p>}
            </div>
          )}

          {!isSystemMessage && msg.time && (
            <span className="message-timestamp">{formatTime(msg.time)}</span>
          )}
        </div>
      );
    })}
  </main>
);

export default MessageContainer;
