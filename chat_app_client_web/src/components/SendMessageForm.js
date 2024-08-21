import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <Form onSubmit={handleSubmit} className="send-message-form">
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={!message}
          className="send-button"
        >
          Send
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
