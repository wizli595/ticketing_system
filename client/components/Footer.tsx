import { Col, Container, Row } from "react-bootstrap";
import styles from "../assets/global.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className={styles.bgSlate}>
        <Container>
          <Row>
            <Col className="text-center py-3">
              <p>The App &copy; {currentYear}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
