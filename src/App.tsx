import React, {
  FunctionComponent,
  Suspense,
  useCallback,
  useEffect,
  lazy,
} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Layout from './Hoc/Layout/Layout';
import PlaylistMaker from './containers/PlaylistMaker/PlaylistMaker';
import Logout from './containers/Auth/Logout/Logout';
import Spinner from './components/UI/Spinner/Spinner';
import * as actions from './store/actions/index';
import { RootState } from './index';

const Playlists = lazy(() => {
  return import('./containers/Playlists/Playlists');
});

const Auth = lazy(() => {
  return import('./containers/Auth/Auth');
});

const App: FunctionComponent = () => {
  const token: boolean = useSelector((state: RootState) => {
    return state.auth.token !== null;
  });
  const dispatch = useDispatch();
  const onTryAutoSignup = useCallback(
    () => dispatch(actions.authCheckState()),
    [dispatch]
  );

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  const routes = !token ? (
    <Switch>
      <Route path="/login" component={Auth} />
      <Route path="/" exact component={PlaylistMaker} />
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/logout" component={Logout} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/" exact component={PlaylistMaker} />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>{routes}</Suspense>
    </Layout>
  );
};

export default withRouter(App);
