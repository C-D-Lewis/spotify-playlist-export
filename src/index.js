const fs = require('fs');
const spotify = require('./modules/spotify');
const util = require('./modules/util');

const [filePath] = process.argv.slice(2);

/** If a line contains this, it's considered a valid URI */
const URI_STEM = 'https://open.spotify.com/track/';

/**
 * Check a file contains only a list of Spotify URIs.
 *
 * @param {string} data - Complete file string.
 * @returns {boolean} true if the list is valid, false otherwise.
 */
const isUriListFile = data => data.split('\n').every(p => p.includes(URI_STEM));

/**
 * The main function.
 */
const main = async () => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Please specify a valid file path');
  }

  const data = fs.readFileSync(filePath, 'utf8');
  if (!isUriListFile(data)) {
    throw new Error('File should contain one Spotify URI per line. Copy and pasting an entire playlist is an easy way to do this.');
  }

  const token = await spotify.getAccessToken();
  const trackIds = data.split('\n').map(p => p.split('/')[4]);

  const tasks = trackIds.map((id, i) => async () => {
    const data = await spotify.getTrack(id, token);

    // Print the data we actually want for further processing
    const info = `\n${i + 1}. ${data.name} - ${data.artists[0].name} (${data.album.name})`;
    console.log(info);
  });
  await util.runTasks(tasks);
  console.log();
};

main();
