import { useState } from "react";
import { Col, Form, FormControl, Row, Button } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState();
  const [chatRoom, setChatRoom] = useState();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        joinChatRoom(username, chatRoom);
      }}
    >
      <Row class="px-5 my-5">
        <Col sm="12">
          <Form.Group>
            <FormControl
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormControl
              placeholder="Chat Room"
              onChange={(e) => setChatRoom(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col sm={12}>
          <hr />
          <Button variant="success" type="submit">
            {" "}
            Join
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default WaitingRoom;
