const base64 = require('base-64');
const fetch = require('node-fetch');

const { CLIENT_ID, CLIENT_SECRET } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Please export CLIENT_ID and CLIENT_SECRET from your Spotify application developer dashboard.');
}

/**
 * Request and return JSON.
 *
 * @param {string} url - URL to fetch.
 * @param {object} opts - Standard request options.
 * @returns {object}
 */
const fetchJson = async (url, opts) => fetch(url, opts).then(res => res.json());

/**
 * Get an access token as a Spotify Application using Client Credentials flow.
 *
 * @returns {string} The access token.
 */
const getAccessToken = async () => {
  try {
    const { access_token } = await fetchJson('https://accounts.spotify.com/api/token', {
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
const getPlaylistPage = async (url, token) =>
  fetchJson(url, { headers: { Authorization: `Bearer ${token}` } });

/**
 * Get all track objects from a given playlist ID.
 *
 * @param {string} id - The playlist ID.
 * @param {string} token - The access token.
 * @returns {object[]} List of track objects.
 */
const getPlaylistTracks = async (id, token) => {
  const results = [];
  let page = await getPlaylistPage(`https://api.spotify.com/v1/playlists/${id}/tracks`, token);
  results.push(...page.items);

  while (page.next) {
    page = await getPlaylistPage(page.next, token);
    results.push(...page.items);
  }

  return results.map(item => item.track);
};

module.exports = {
  getAccessToken,
  getPlaylistTracks,
};
