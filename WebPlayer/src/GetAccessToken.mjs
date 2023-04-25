import fetch from "node-fetch";

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../dotenv/env.js";

const auth_token = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

const getAuthWithFetch = async () => {
  try {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = new URLSearchParams({
      grant_type: "client_credentials",
    }).toString();

    const response = await fetch(token_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    }).then((res) => res.json());
    return response.access_token;
  } catch (error) {
    console.log(error);
  }
};

const token = await getAuthWithFetch();
export default token;
