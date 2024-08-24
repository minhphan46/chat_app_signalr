import { useState } from "react";
import {Form, FormControl, Button, Spinner } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    setError("");
    setIsLoading(true); // Start loading
    joinChatRoom(username);
  };

  return (
    <div className="waiting-room">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <FormControl
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            style={{ width: "50%", margin: "30px auto" }}
            isInvalid={!!error}
            disabled={isLoading} // Disable input when loading
          />
          <FormControl.Feedback type="invalid">{error}</FormControl.Feedback>
        </Form.Group>
        <Button
          variant="success"
          type="submit"
          style={{ width: "50%" }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Loading...
            </>
          ) : (
            "Join"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default WaitingRoom;
