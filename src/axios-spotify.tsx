import axios from 'axios';

export const redirect_uri =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000/login'
    : 'https://spotifyplaylistmaker-9f04b.web.app/login';
export const prefixURL = 'https://accounts.spotify.com/';
export const client_id = '4ab35e6f4e00492f9af5a2358e409f9f';
export const instance = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
});

export default instance;
