"use client";
import FormContainer from '@/components/Form-container';
import useRequest from '@/hooks/useRequest';
import { AxiosError } from 'axios';
import React, { useState } from 'react'
import { Form,Button  } from 'react-bootstrap';
import type { CustomError } from '@/types/global.d.ts';
type Props = {}


const Page = (props: Props) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const {doRequest,error}=useRequest({url:'/api/users/signup',method:'post',body:credentials})

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(credentials);
        console.log((error?.response?.data as CustomError)?.errors)
        await doRequest();
        // if (error?.response?.data && (error.response?.data as CustomError).errors) {
        //     const errors = (error.response?.data as CustomError).errors;
        //     errors?.forEach((error) => {
        //         setErrors((prevErrors) => ({ ...prevErrors, [error.field as string]: error.message as string }));
        //     });
        // }
        // if (error  && (error?.response?.data as CustomError).errors) {
        //     const fieldErrors = (error?.response?.data as CustomError)?.errors.reduce((acc, err) => {
        //         acc[err.field as string] = err.message as string;
        //         return acc;
        //     }, {});
        //     setErrors(fieldErrors);
        // }
    };

  return (
      <>
      <FormContainer >
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder="Enter Email..."
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                    </Form.Control.Feedback>
                            {errors.email}
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
                    <Form.Control.Feedback type="invalid">
                        </Form.Control.Feedback>
                            {errors.password}
                </Form.Group>
                {/* {error && <p>{error.message}</p>} */}
                <Button type="submit">Sign Up</Button>
            </form>
        </FormContainer>
      </>
  );
}

export default Page;