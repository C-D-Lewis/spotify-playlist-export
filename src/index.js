const fs = require('fs');
const spotify = require('./modules/spotify');

const [arg, outPath] = process.argv.slice(2);

/**
 * Get playlist ID from either a URI or URL.
 *
 * @returns {string} The playlist ID.
 */
const getPlaylistId = () => {
  if (arg.includes('spotify:playlist:')) {
    return arg.split(':')[2];
  }

  if (arg.includes('https://open.spotify.com/playlist/')) {
    return arg.split('?')[0].split('/').pop();
  }

  throw new Error('Please specify either a Spotify URI or Spotify playlist URL.');
};

/**
 * Get all tracks as a list string.
 *
 * @param {object[]} tracks - The track list.
 * @returns {string} Track list information as a string.
 */
const getTrackListString = tracks => tracks.reduce(
  (res, t, i) => `${res}\n${i + 1}. ${t.name} - ${t.artists[0].name} (${t.album.name})`,
  ''
).trim();

/**
 * Get all tracks as a simplified JSON format.
 *
 * @param {object[]} tracks - The track list.
 * @returns {object[]} Track list information as an object list.
 */
const getTrackListJson = tracks => tracks.reduce((res, t, i) => res.concat({
  number: i + 1,
  name: t.name,
  artist: t.artists[0].name,
  album: t.album.name,
}), []);

const writeFile = (tracks) => {
  if (outPath.includes('json')) {
    fs.writeFileSync(outPath, JSON.stringify(getTrackListJson(tracks), null, 2), 'utf8');
    return;
  }

  fs.writeFileSync(outPath, getTrackListString(tracks), 'utf8');
};

/**
 * The main function.
 */
const main = async () => {
  if (!outPath) {
    throw new Error('Please specify an output path, such as output.txt or output.json');
  }

  const token = await spotify.getAccessToken();
  const tracks = await spotify.getPlaylistTracks(getPlaylistId(), token);

  writeFile(tracks);
};

main();
