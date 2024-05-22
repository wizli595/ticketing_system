import Loader from "@/components/loader";
import useRequest from "@/hooks/use-Request";
import Router from 'next/router';
import { useEffect } from "react";
const signout = () => {

    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    })
    useEffect(() => {
        doRequest()
    }, [])

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div>
                <p className="m-3">
                    Signing you Out...
                </p>
                <Loader />
            </div>
        </div>);
}

export default signout;