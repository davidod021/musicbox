const express     = require('express');
const querystring = require('querystring');
const request     = require('request');
const cors        = require('cors');

const init = () => {
  const router = express.Router();
  let   access_token = '';
  let   rfid;

  let state = "";
  const redirect_uri = 'http://localhost:4000/spotify/callback';

  const generateRandomString = (myLength) => {
    const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
  };

  router.get('/login/:rfid', (req, rsp) => {
    const scope = 'user-read-private user-read-email';
    rfid  = req.params.rfid;
    state = generateRandomString(16);
    rsp.redirect('https://accounts.spotify.com/authorize/?' +
      new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
    );
  });

  router.get('/callback', (req, rsp) => {
    if (req.query.state === state) {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: req.query.code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': ('Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        json: true
      };
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          access_token = body.access_token;
          rsp.redirect(`http://localhost:4000/rfid/${rfid}`);
        }
      });
    }
  });

  router.get('/token', (req, rsp) => {
    rsp.json({access_token: access_token});
  });

  return router;
}

module.exports = init;