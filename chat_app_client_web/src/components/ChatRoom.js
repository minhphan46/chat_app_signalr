import MessageContainer from "./MessageContainer";
import { useState, useRef } from "react";

function ChatRoom({ userId, messages, sendMessage }) {
  const dummy = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const [message, setMessage] = useState("");
  return (
    <>
      <main>
        <MessageContainer userId={userId} messages={messages} />
        <span ref={dummy}></span>
      </main>

      <form className="message-form" onSubmit={handleSubmit}>
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
