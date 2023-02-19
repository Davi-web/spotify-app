import axios from "axios";
const Spotify = (app) => {
    const stateKey = "spotify_auth_state";
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const FRONTEND_URI = process.env.FRONTEND_URI;
    const generateRandomString = (length) => {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };
  
    app.get("/v1/login", (req, res) => {
      const state = generateRandomString(16);
      const scope = [
        "user-read-private",
        "playlist-read-private",
        "user-read-email",
        "user-top-read",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
      ].join(" ");
      const queryParams = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
      }).toString();
      console.log(queryParams);
  
      res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    });
  
    app.get("/v1/callback", (req, res) => {
      var code = req.query.code || null;
      var state = req.query.state || null;
      if (state === null) {
        // res.redirect(
        //   "/" +
        //     querystring.stringify({
        //       error: "state_mismatch",
        //     })
        // );
      } else {
        const queryParams =new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }).toString();
  
        axios({
          method: "post",
          url: `https://accounts.spotify.com/api/token`,
          data: queryParams,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${new Buffer.from(
              `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        })
          .then((response) => {
            if (response.status === 200) {
              const { access_token, refresh_token, expires_in } = response.data;
              const params = new URLSearchParams({
                access_token,
                refresh_token,
                expires_in,
              }).toString();
  
              res.status(200).redirect(`/?${params}`);
            } else {
              res.redirect(
                `/?${new URLSearchParams({ error: "invalid_token" }).toString()}`
              );
            }
          })
          .catch((error) => {
            res.send(error);
          });
      }
    });
  
    app.post("/v1/success", (req, res) => {
      // Regenerate session when signing in to prevent fixation
      const { access_token, username, email, spotifyId } = req.body;
      console.log("Session.login: ", req.body);
      const user = {
        access_token,
        username,
        email,
        spotifyId,
      };
      res.status(200).send(user);
      
    });
  
    
    app.get("/v1/refresh_token", (req, res) => {
      const { refresh_token } = req.query;
      console.log(refresh_token);
      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }).toString(),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      })
        .then((response) => {
          // res.send(response.data);
          if (response.status === 200) {
            const { access_token, token_type } = response.data;
            res.status(200).send({
              spotify_access_token: access_token,
            });
          } else {
            res.send(response);
          }
        })
        .catch((err) => {
          res.send(err);
        });
    });
  
}

export default Spotify;