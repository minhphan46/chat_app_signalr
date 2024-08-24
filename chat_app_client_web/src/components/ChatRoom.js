import React, { useState, useRef } from "react";
import MessageContainer from "./MessageContainer";
import { convertBase64 } from "../utils/image_util";
import debounce from "lodash.debounce";

function ChatRoom({ userId, messages, sendMessage }) {
  const dummy = useRef();
  const [message, setMessage] = useState("");
  const [base64, setBase64] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // Sử dụng useRef để giữ debounce function
  const debouncedSendMessage = useRef(
    debounce((messagePayloadString) => {
      sendMessage(messagePayloadString);
    }, 500)
  ).current;

  const handleSendMessage = () => {
    const messagePayload = {
      text: message,
      image: base64,
    };

    const messagePayloadString = JSON.stringify(messagePayload);

    debouncedSendMessage(messagePayloadString);

    setMessage("");
    setSelectedImage(null);
    setBase64("");
    fileInputRef.current.value = null;
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
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
          👉
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
