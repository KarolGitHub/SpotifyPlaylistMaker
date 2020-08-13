import React, { FunctionComponent, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Layout from "./Hoc/Layout/Layout";
import PlaylistMaker from "./containers/PlaylistMaker/PlaylistMaker";
import Auth from "./containers/Auth/Auth";
import Spinner from "./components/UI/Spinner/Spinner";

type Props = {};

const App: FunctionComponent<Props> = () => {
  const routes = (
    <Switch>
      <Route path="/login" component={Auth} />
      <Route path="/" exact component={PlaylistMaker} />
    </Switch>
  );

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>{routes}</Suspense>
    </Layout>
  );
};

export default withRouter(App);
