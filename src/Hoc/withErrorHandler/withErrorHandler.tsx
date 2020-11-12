import React from "react";

import Modal from "../../components/UI/Modal/Modal";
import useHttpErrorHandler from "../customHooks/http-error-handler";

const withErrorHandler = (WrappedComponent: any, axios: any) => {
  return (props: any) => {
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <React.Fragment>
        <Modal open={error} clicked={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };
};

export default withErrorHandler;
