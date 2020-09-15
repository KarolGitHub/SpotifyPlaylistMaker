import { useState, useEffect } from "react";
import Axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

export default (httpClient: any) => {
  const [error, setError] = useState<boolean | any>(false);
  const { request, response } = httpClient.interceptors;
  const reqInterceptor = request.use((req: AxiosRequestConfig) => {
    setError(false);
    return req;
  });
  const resInterceptor = response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError) => {
      if (!Axios.isCancel(err)) {
        setError(err);
      }
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    return () => {
      request.eject(reqInterceptor);
      response.eject(resInterceptor);
    };
  }, [reqInterceptor, resInterceptor, request, response]);

  const errorConfirmedHandler = () => {
    setError(false);
  };

  return [error, errorConfirmedHandler];
};
