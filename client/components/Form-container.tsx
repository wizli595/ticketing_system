import { Container, Row, Col } from "react-bootstrap";

type Props = {
    children: React.ReactNode;
};

const FormContainer = ({ children }:Props) => {
    return (<>
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </Row>
        </Container>

    </>);
}

export default FormContainer;