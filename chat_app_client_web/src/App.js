import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <main>
        <Container>
          <Row class="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">Wellcome to the F1 ChatApp</h1>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default App;
