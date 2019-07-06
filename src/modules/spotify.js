const base64 = require('base-64');
const request = require('request-promise-native');

const { CLIENT_ID, CLIENT_SECRET } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Please export CLIENT_ID and CLIENT_SECRET from your Spotify application developer dashboard.');
}

/**
 * Request and return JSON.
 *
 * @param {object} opts - Standard request options.
 * @returns {object}
 */
const requestJson = async opts => request(opts).then(res => JSON.parse(res));

/**
 * Get an access token as a Spotify Application using Client Credentials flow.
 *
 * @returns {string} The access token.
 */
const getAccessToken = async () => {
  try {
    const { access_token } = await requestJson({
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
 * Get a page from a Playlist, limit 100 per page.
 *
 * @param {string} url - Page URL.
 * @param {string} token - The access token.
 * @returns {object} The response.
 */
const getPlaylistPage = async (url, token) => requestJson({
  url,
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Get all track objects from a given playlist ID.
 *
 * @param {string} id - The playlist ID.
 * @param {string} token - The access token.
 * @returns {object[]} List of track objects.
 */
const getPlaylistTracks = async (id, token) => {
  const all = [];
  let page = await getPlaylistPage(`https://api.spotify.com/v1/playlists/${id}/tracks`, token);
  all.push(...page.items);

  while (page.next) {
    page = await getPlaylistPage(page.next, token);
    all.push(...page.items);
  }

  return all.map(item => item.track);
};

module.exports = {
  getAccessToken,
  getPlaylistTracks,
};
