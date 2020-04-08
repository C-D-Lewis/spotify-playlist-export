const fs = require('fs');
const { getAccessToken, getPlaylistTracks } = require('./modules/spotify');

const [arg, outPath] = process.argv.slice(2);

/**
 * Get playlist ID from either a URI or URL.
 *
 * @returns {string} The playlist ID.
 */
const getPlaylistId = () => {
  if (arg.includes('spotify:playlist:')) return arg.split(':')[2];
  if (arg.includes('https://open.spotify.com/playlist/')) return arg.split('?')[0].split('/').pop();

  throw new Error('Please specify either a Spotify URI or Spotify playlist URL.');
};

/**
 * Get all tracks as a list string.
 *
 * @param {Object[]} tracks - The track list.
 * @returns {string} Track list information as a string.
 */
const getTrackListString = tracks => tracks
  .map((t, i) => `${i + 1} ${t.artists[0].name} - ${t.name} (${t.album.name})`)
  .join('\n')
  .trim();

/**
 * Get all tracks as a simplified JSON format.
 *
 * @param {Object[]} tracks - The track list.
 * @returns {Object[]} Track list information as an object list.
 */
const getTrackListJson = tracks => tracks
  .map((t, i) => ({
    number: i + 1,
    name: t.name,
    artist: t.artists[0].name,
    album: t.album.name,
  }));

/**
 * Get all tracks as a CSV file of the main attributes.
 *
 * @param {Object[]} tracks - The track list.
 * @returns {string} Track list information as a CSV file.
 */
const getTrackListCsv = tracks => {
  const headers = 'Number,Name,Artist,Album\n';
  const trackLines = tracks
    .map((t, i) => `${i + 1},"${t.name}","${t.artists[0].name}","${t.album.name}"\n`)
    .join('');
  return headers
    .concat(trackLines)
    .trim();
};

/**
 * Write the output file as a list, JSON, or CSV.
 *
 * @param {Object[]} tracks - The track list.
 */
const writeFile = (tracks) => {
  if (outPath.includes('json')) {
    fs.writeFileSync(outPath, JSON.stringify(getTrackListJson(tracks), null, 2), 'utf8');
    return;
  }

  if (outPath.includes('csv')) {
    fs.writeFileSync(outPath, getTrackListCsv(tracks), 'utf8');
    return;
  }

  fs.writeFileSync(outPath, getTrackListString(tracks), 'utf8');
};

/**
 * The main function.
 */
const main = async () => {
  if (!outPath) throw new Error('$ node src/index.js $outPath.[json|txt|csv]');

  const token = await getAccessToken();
  const tracks = await getPlaylistTracks(getPlaylistId(), token);

  writeFile(tracks);
  console.log(`Wrote ${outPath}`);
};

main();
