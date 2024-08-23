import { useEffect, useState, useRef } from "react";
import MessageContainer from "./MessageContainer";

function ChatRoom({ userId, messages, sendMessage }) {
  const dummy = useRef();

  const [message, setMessage] = useState("");

  // useEffect để tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

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
