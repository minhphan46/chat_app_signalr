import { useState } from "react";
import { Col, Form, FormControl, Row, Button, Spinner } from "react-bootstrap";

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
        <Row className="px-5 my-5">
          <Col sm="12">
            <Form.Group>
              <FormControl
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                isInvalid={!!error}
                disabled={isLoading} // Disable input when loading
              />
              <FormControl.Feedback type="invalid">
                {error}
              </FormControl.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Button
          variant="success"
          type="submit"
          className="join-button"
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
