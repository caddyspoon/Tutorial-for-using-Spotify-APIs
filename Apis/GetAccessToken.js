import fetch from "node-fetch";
import axios from "axios";
import qs from "qs";

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLINE_SECRET } from "./dotenv/env.js";

/*
Origin Source of Following Codes:
https://ritvikbiswas.medium.com/connecting-to-the-spotify-api-using-node-js-and-axios-client-credentials-flow-c769e2bee818
*/

const auth_token = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLINE_SECRET}`,
  "utf-8"
).toString("base64");

// Origin Source: getAuth with axios
const getAuthWithAxios = async () => {
  try {
    //make post request to SPOTIFY API for access token, sending relavent info
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    //return access token
    return response.data.access_token;
    //console.log(response.data.access_token);
  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
};

// My code: Using fetch
const getAuthWithFetch = async () => {
  try {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

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

// And here is the token
// const token = await getAuthWithAxios();
const token = await getAuthWithFetch();
export default token;
