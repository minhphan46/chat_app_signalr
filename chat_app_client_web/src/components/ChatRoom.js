import React, { useState, useRef, useEffect } from "react";
import MessageContainer from "./MessageContainer";

function ChatRoom({ userId, messages, sendMessage }) {
  const dummy = useRef();

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // useEffect để tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    setSelectedImage(null);
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = null; // Reset giá trị input file
  };

  return (
    <>
      <main>
        <MessageContainer userId={userId} messages={messages} />
        <span ref={dummy}></span>
      </main>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
          ref={fileInputRef}
        />
        <label htmlFor="image-upload" className="image-upload-label">
          📷
        </label>
        {selectedImage && (
          <div className="image-preview-container">
            <img src={selectedImage} alt="Preview" className="image-preview" />
            <button
              type="button"
              className="remove-image-button"
              onClick={removeImage}
            >
              &times;
            </button>
          </div>
        )}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button type="submit" disabled={!message}>
          🕊️
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
