import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Form, Row, Col, Container, Button } from "react-bootstrap";

interface UserCredentials {
    email: string;
    password: string;
}

const Signup: FC = () => {

    const [credentials, setCredentials] = useState<UserCredentials>({
        email: '',
        password: ''
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials((prv): UserCredentials => {
            return { ...prv, [name]: value }
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(credentials);
    }

    return (<Container>

        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
                <h1>Sign Up</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email" className="my-3">
                        <Form.Label>Email Adress</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter Email ..."
                            value={credentials.email}
                            onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="password" className="my-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password ..."
                            name="password"
                            value={credentials.password}
                            onChange={handleChange} />
                    </Form.Group>
                    <Button type='submit'>Sign up</Button>
                </Form>
            </Col>
        </Row>

    </Container>);
}

export default Signup;