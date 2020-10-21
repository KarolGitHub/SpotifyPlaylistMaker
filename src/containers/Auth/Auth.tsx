import React, { FunctionComponent, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";

import { RootState } from "../../index";
import * as actions from "./../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import { authPopup } from "../../shared/utility";

const Auth: FunctionComponent = () => {
  const dispatch = useDispatch();

  const token: string = useSelector((state: RootState) => {
    return state.auth.token;
  });
  const loading: boolean = useSelector((state: RootState) => {
    return state.auth.loading;
  });
  const error: boolean = useSelector((state: RootState) => {
    return state.auth.error;
  });
  const authRedirectPath: string = useSelector((state: RootState) => {
    return state.auth.authRedirectPath;
  });

  const onAuth = useCallback(() => dispatch(actions.auth()), [dispatch]);

  useEffect(() => {
    if (authRedirectPath) {
      window.addEventListener("storage", () => {
        const storage = window.localStorage.getItem("token");
        if (storage !== null) {
          window.removeEventListener("storage", () => {});
          dispatch(actions.authCheckState());
        }
      });
      authPopup(authRedirectPath);
    } else {
      onAuth();
    }
  }, [onAuth, authRedirectPath, dispatch]);

  const redirect = !token ? (
    !loading ? (
      !error ? (
        <Spinner />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Spinner />
    )
  ) : (
    <Redirect to="/" />
  );

  return redirect;
};

export default Auth;
