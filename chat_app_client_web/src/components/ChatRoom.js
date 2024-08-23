import React, { useState, useRef, useEffect } from "react";
import MessageContainer from "./MessageContainer";
import { convertBase64 } from "../utils/image_util";

function ChatRoom({ userId, messages, sendMessage }) {
  const dummy = useRef();

  const [message, setMessage] = useState("");
  const [base64, setBase64] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // useEffect để tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo đối tượng tin nhắn
    const messagePayload = {
      text: message,
      image: base64,
    };

    // Chuyển đổi đối tượng thành chuỗi JSON
    const messagePayloadString = JSON.stringify(messagePayload);

    // Gửi tin nhắn dưới dạng chuỗi JSON
    sendMessage(messagePayloadString);

    setMessage("");
    setSelectedImage(null);
    setBase64("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBase64(base64);
    setSelectedImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = null;
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
          onChange={uploadImage}
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
        <button type="submit" disabled={!message && !selectedImage}>
          🕊️
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
