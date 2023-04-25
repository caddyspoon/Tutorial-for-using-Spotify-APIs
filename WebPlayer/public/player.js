const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get("accessToken");

window.onSpotifyWebPlaybackSDKReady = async () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  if (!accessToken) {
    console.error("No access token provided.");
    return;
  }

  const { Player } = window.Spotify;

  const player = new Player({
    name: "Spotify Web Player",
    getOAuthToken: (cb) => {
      cb(accessToken);
    },
  });

  player.addListener("player_state_changed", (state) => {
    // Update UI elements when the player state changes
    document.getElementById("trackName").innerText =
      state.track_window.current_track.name;
    document.getElementById("artistName").innerText =
      state.track_window.current_track.artists[0].name;
    document.getElementById("albumArt").src =
      state.track_window.current_track.album.images[0].url;

    if (state.paused) {
      document.getElementById("playButton").disabled = false;
      document.getElementById("pauseButton").disabled = true;
    } else {
      document.getElementById("playButton").disabled = true;
      document.getElementById("pauseButton").disabled = false;
    }
  });

  document.getElementById("pauseButton").addEventListener("click", () => {
    player.pause();
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    player.nextTrack();
  });

  // Add event listeners for the player controls
  document.getElementById("previousButton").addEventListener("click", () => {
    player.previousTrack();
  });

  document.getElementById("playButton").addEventListener("click", () => {
    player.resume();
  });
  player.addListener("initialization_error", ({ message }) => {
    console.error("Initialization error:", message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error("Authentication error:", message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error("Account error:", message);
  });

  player.addListener("ready", async ({ device_id }) => {
    console.log("Ready with Device ID", device_id);

    const playButton = document.getElementById("playButton");
    // "Define A Transparent Dream" by "The Olivia Tremor Control"
    const trackId = "5kbOst85dRDPRcWUV9GeFx";

    playButton.addEventListener("click", async () => {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (player._options.paused) {
        player.resume();
      } else {
        // Save the response of the play request
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 204 || response.status === 202) {
          console.log("Track is playing");

          // Set player options to paused: false after playing the track
          player._options.paused = false;
        } else {
          console.error(
            "Error playing track:",
            response.status,
            response.statusText
          );
        }
      }
    });
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  // Connect Button
  const connectWithToken = () => {
    player.connect().catch((e) => {
      console.error("Error connecting to Spotify Web Playback SDK:", e);
    });

    audioContext.resume();

    const volumeSlider = document.getElementById("volumeSlider");

    player.setVolume(volumeSlider.value / 100).catch((error) => {
      console.error("Error setting the initial volume:", error);
    });

    volumeSlider.addEventListener("input", () => {
      player.setVolume(volumeSlider.value / 100).catch((error) => {
        console.error("Error changing the volume:", error);
      });
    });
  };

  const volumeSlider = document.getElementById("volumeSlider");

  player.setVolume(volumeSlider.value / 100).catch((error) => {
    console.error("Error setting the initial volume:", error);
  });

  volumeSlider.addEventListener("input", () => {
    player.setVolume(volumeSlider.value / 100).catch((error) => {
      console.error("Error changing the volume:", error);
    });
  });

  player.addListener("player_state_changed", (state) => {
    console.log("Player state changed:", state);
  });

  // Playback bar

  let playbackBar = document.getElementById("playbackBar");
  let timeDisplay = document.getElementById("timeDisplay");

  function updatePlaybackBar(position, duration) {
    let percentage = (position / duration) * 100;
    playbackBar.value = percentage;
  }

  function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function updatePlaybackState() {
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }

      let { position, duration } = state;
      updatePlaybackBar(position, duration);
      timeDisplay.innerText = `${formatTime(position)} / ${formatTime(
        duration
      )}`;
    });
  }

  // Call updatePlaybackState every second to update the playback bar and time display
  setInterval(updatePlaybackState, 1000);

  playbackBar.addEventListener("input", () => {
    let newPosition = (playbackBar.value / 100) * player._options.duration;
    player.seek(newPosition);
  });

  connectWithToken();
};
