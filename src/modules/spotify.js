const base64 = require('base-64');
const util = require('./util');

const { CLIENT_ID, CLIENT_SECRET } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Please export CLIENT_ID and CLIENT_SECRET from your Spotify application developer dashboard.');
}

/**
 * Get an access token as a Spotify Application using Client Credentials flow.
 *
 * @returns {string} The access token.
 */
const getAccessToken = async () => {
  try {
    const { access_token } = await util.requestJson({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    return access_token;
  } catch(e) {
    console.log('Bad credentials?');
    console.log(`Error was: ${e.stack}`);
  }
};

/**
 * Get track data by ID.
 *
 * @param {string} id - The Spotify track ID from the URI list file.
 * @param {string} token - The API token.
 * @returns {object} Track data.
 */
const getTrack = async (id, token) => util.requestJson({
  url: `https://api.spotify.com/v1/tracks/${id}`,
  headers: { Authorization: `Bearer ${token}` },
});

module.exports = {
  getAccessToken,
  getTrack,
};
