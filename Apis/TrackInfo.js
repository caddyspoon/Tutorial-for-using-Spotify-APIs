import fetch from "node-fetch";

import token from "./GetAccessToken.js";

// API GUIDES
// https://developer.spotify.com/documentation/web-api/reference/#/
const getAudioFeatures_Track = async (track_id) => {
  const url = `https://api.spotify.com/v1/tracks/${track_id}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.log(error);
  }
};

const defineATransparentDream = "5kbOst85dRDPRcWUV9GeFx";
console.log(await getAudioFeatures_Track(defineATransparentDream));
