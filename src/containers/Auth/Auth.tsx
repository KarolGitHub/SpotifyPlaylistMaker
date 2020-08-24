import React, { FunctionComponent, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";

import { RootState } from "../../index";
import * as actions from "./../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

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
  /*   const onSetAuthRedirectURL = useCallback(() =>
      dispatch(actions.setAuthRedirectURL()), [dispatch]); */

  useEffect(() => {
    if (authRedirectPath) {
      window.location.assign(authRedirectPath);
    } else {
      onAuth();
    }
  }, [onAuth, authRedirectPath]);

  const redirect = !loading ? (
    !token ? (
      !error ? (
        <Spinner />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Redirect to="/" />
    )
  ) : (
    <Spinner />
  );

  return redirect;
};

export default Auth;
