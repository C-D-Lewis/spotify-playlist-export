const base64 = require('base-64');
const fs = require('fs');
const request = require('request-promise-native');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const [filePath] = process.argv.slice(2);

/** If a line contains this, it's considered a valid URI */
const URI_STEM = 'https://open.spotify.com/track/';

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
      body: 'grant_type=client_credentials',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
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
const getTrack = async (id, token) => {
  const track = await requestJson({
    url: `https://api.spotify.com/v1/tracks/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return track;
};

/**
 * Check a file contains only a list of Spotify URIs.
 *
 * @param {string} data - Complete file string.
 * @returns {boolean} true if the list is valid, false otherwise.
 */
const isUriListFile = data => data.split('\n').every(p => p.includes(URI_STEM));

const runTasks = async (tasks) => {
  await Promise.all(tasks.splice(0, 1).map(p => p()));
  if (!tasks.length) {
    return;
  }

  await runTasks(tasks);
};

/**
 * The main function.
 */
const main = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Please export CLIENT_ID and CLIENT_SECRET from your Spotify application developer dashboard.');
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Please specify a valid file path');
  }

  const data = fs.readFileSync(filePath, 'utf8');
  if (!isUriListFile(data)) {
    throw new Error('File should contain one Spotify URI per line. Copy and pasting an entire playlist is an easy way to do this.');
  }

  const token = await getAccessToken();
  const trackIds = data.split('\n').map(p => p.split('/')[4]);

  const tasks = trackIds.map((id, i) => async () => {
    const data = await getTrack(id, token);

    // Print the data we actually want for further processing
    const info = `\n${i + 1}. ${data.name} - ${data.artists[0].name} (${data.album.name})`;
    console.log(info);
  });
  await runTasks(tasks);
};

main();
