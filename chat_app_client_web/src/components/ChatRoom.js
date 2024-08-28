import React, { useState, useEffect, useRef } from "react";
import MessageContainer from "./MessageContainer";
import { convertBase64 } from "../services/ImageService";

function ChatRoom({
  userId,
  messages,
  sendMessage,
  sendMessageToUser,
  fetchOldMessages,
}) {
  // const hasFetchedMessages = useRef(false);
  const dummy = useRef();
  const [message, setMessage] = useState("");
  const [base64, setBase64] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [recipientId, setRecipientId] = useState(""); // New state for user ID
  const [isTagging, setIsTagging] = useState(false); // State to toggle user ID input
  const fileInputRef = useRef();

  // useEffect(() => {
  //   if (!hasFetchedMessages.current) {
  //     fetchOldMessages();
  //     hasFetchedMessages.current = true;
  //   }
  // }, [fetchOldMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create message payload
    const messagePayload = {
      text: message,
      image: base64,
    };

    // Convert payload to JSON string
    const messagePayloadString = JSON.stringify(messagePayload);

    // Send message as JSON string, either to a specific user or to the room
    console.log("Recipient ID: ", recipientId);
    if (recipientId) {
      sendMessageToUser(recipientId, messagePayloadString);
    } else {
      sendMessage(messagePayloadString);
    }

    setMessage("");
    setSelectedImage(null);
    setBase64("");
    setRecipientId("");
    setIsTagging(false);
    fileInputRef.current.value = null;
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

        <label
          type="button"
          className="tag-user-button"
          onClick={() => setIsTagging(!isTagging)}
        >
          📌
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
        {isTagging && (
          <input
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="Enter user ID"
            className="recipient-id-input"
          />
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
