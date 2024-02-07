import axios from "axios";

export const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // Server-side Axios instance with provided headers
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // Client-side Axios instance with default options
    return axios.create({
      baseURL: "/",
    });
  }
};
