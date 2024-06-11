import FormContainer from "./form-Container";
import useRequest from "@/hooks/use-Request";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Router from 'next/router';
const MainForm = ({ uri, formBase }) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const { doRequest, error } = useRequest({
        url: uri,
        method: 'post',
        body: credentials,
        onSuccess: () => Router.push("/")
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prv => {
            return {
                ...prv, [name]: value
            };
        });
        setErrors(prv => {
            return {
                ...prv, [name]: ""
            };
        }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
        if (error) {
            console.log("err", error);
            const fieldError = error.response.data.errors.reduce((acc, err) => {
                acc[err.field] = err.message;
                return acc;
            }
                , {});
            setErrors(fieldError);
        }
    };

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
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder="Enter Password..."
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                {/* {error} */}
                <Button type="submit">Sign {formBase}</Button>
            </form>
        </FormContainer>
    </>);
};

export default MainForm;