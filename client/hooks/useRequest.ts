import axios, { AxiosError, isAxiosError } from "axios";
import { useState } from "react";

type Method = 'get' | 'post' | 'put' | 'delete';
type ResquestProps = {
    url: string;
    method: Method;
    body?: any;
    onSuccess?: (data: any) => void;
    };


const useRequest = ({ url, method, body, onSuccess }:ResquestProps) => {
  const [error, setError] = useState<AxiosError | null>(null);

  const doRequest = async () => {
    try {
      setError(null);

      const response = await axios[method](url, { ...body });

      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err) {
       if(isAxiosError(err)){
        setError(err);
        }
  };
  };
  return { doRequest, error };
};

export default useRequest;