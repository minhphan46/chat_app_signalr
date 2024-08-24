import React, { useEffect, useRef, useState } from "react";
import { Col, Modal } from "react-bootstrap";
import { getColorForUsername } from "../utils/avatar_color_util";
import { formatTime } from "../utils/time_util";

const MessageContainer = ({ userId, messages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <main>
      {messages.map((msg, index) => {
        const isSystemMessage = msg.userId === 0;
        const isCurrentUser = msg.userId === userId;

        const messageClass = isSystemMessage
          ? "system"
          : isCurrentUser
          ? "sent"
          : "received";

        const avatarColor = getColorForUsername(msg.username);

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
                <div
                  className="avatar"
                  style={{ backgroundColor: avatarColor }}
                >
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
                      onClick={() => handleImageClick(imageContent)}
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
      <div ref={messagesEndRef} />

      <Modal show={!!selectedImage} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: "black" }}>
          <div className="image-modal-container">
            <button className="close-modal-button" onClick={handleClose}>
              &times;
            </button>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default MessageContainer;
