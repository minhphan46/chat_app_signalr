import { useState } from "react";
import { Col, Form, FormControl, Row, Button } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState("");

  return (
    <div className="waiting-room">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          joinChatRoom(username);
        }}
      >
        <Row className="px-5 my-5">
          <Col sm="12">
            <Form.Group>
              <FormControl
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
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
