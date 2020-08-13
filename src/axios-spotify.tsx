import axios from "axios";

export const prefixURL = "https://accounts.spotify.com/";

export const instance = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export default instance;
