import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import open from "open";
import axios from "axios";
import qs from "qs";

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "./dotenv/env.js";

// TODO: token 별도처리
import token from "./src/GetAccessToken.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clientId = SPOTIFY_CLIENT_ID;
const clientSecret = SPOTIFY_CLIENT_SECRET;
const redirectUri = "http://localhost:3000/callback";

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log(1);
  res.sendFile(path.join(__dirname, "player.html"));
});

app.get("/login", (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=user-read-private%20user-read-email%20streaming%20user-read-playback-state%20user-modify-playback-state&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  // Redirect the user to the Spotify authorization page
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
      }
    );

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    res.send(
      "Access token and refresh token received. You can close this window."
    );

    // Open your web app with the access token
    open(`http://localhost:3000/player?accessToken=${accessToken}`);
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).send("Error fetching access token.");
  }
});

app.get("/player", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "player.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  open("http://localhost:3000/login");
});
