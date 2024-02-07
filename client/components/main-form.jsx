import FormContainer from "@/components/form-container";
import useRequest from "@/hooks/use-Request";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Router from 'next/router';
const MainForm = ({ uri, formBase }) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const { doRequest, error } = useRequest({
        url: uri,
        method: 'post',
        body: credentials,
        onSuccess: () => Router.push("/")
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials(prv => {
            return {
                ...prv, [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await doRequest()
    }

    return (<>
        <FormContainer >
            <form onSubmit={handleSubmit}>
                <h1>Sign {formBase}</h1>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder="Enter Email..."
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder="Enter Password..."
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </Form.Group>
                {error}
                <Button type="submit">Sign {formBase}</Button>
            </form>
        </FormContainer>
    </>);
}

export default MainForm;