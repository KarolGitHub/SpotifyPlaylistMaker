import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import playlistMakerReducer from "./store/reducers/playlistMaker";
import authReducer from "./store/reducers/auth";
import playerReducer from "./store/reducers/player";
import playlistsReducer from "./store/reducers/playlists";

const reducer = combineReducers({
  playlistMaker: playlistMakerReducer,
  auth: authReducer,
  player: playerReducer,
  playlists: playlistsReducer,
});

export type RootState = ReturnType<typeof reducer>;

export const redirect_uri =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/login"
    : "https://spotifyplaylistmaker-9f04b.web.app/login";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
