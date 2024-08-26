import { useState } from "react";
import { Form, FormControl, Button, Spinner } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom, isPrivate }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (isPrivate && !roomId.trim()) {
      setError("Room ID cannot be empty for private chat.");
      return;
    }
    setError("");
    setIsLoading(true); // Start loading
    joinChatRoom(username, roomId);
  };

  return (
    <div className="waiting-room">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <FormControl
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            style={{ width: "50%", margin: "10px auto" }}
            isInvalid={!!error}
            disabled={isLoading} // Disable input when loading
          />
          {isPrivate && (
            <FormControl
              placeholder="Room ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              style={{ width: "50%", margin: "10px auto" }}
              isInvalid={!!error}
              disabled={isLoading} // Disable input when loading
            />
          )}
          <FormControl.Feedback type="invalid">{error}</FormControl.Feedback>
        </Form.Group>
        <Button
          variant="success"
          type="submit"
          style={{ width: "50%", margin: "10px auto" }}
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
