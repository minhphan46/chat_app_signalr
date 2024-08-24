import { useState } from "react";
import { Col, Form, FormControl, Row, Button } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    setError("");
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
              />
              <FormControl.Feedback type="invalid">
                {error}
              </FormControl.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit" className="join-button">
          Join
        </Button>
      </Form>
    </div>
  );
};

export default WaitingRoom;
