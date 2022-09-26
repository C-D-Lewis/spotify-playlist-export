const fs = require('fs');
const { getAccessToken, getPlaylistTracks, getPlaylistData } = require('./modules/spotify');

const [outType, uri] = process.argv.slice(2);

/**
 * Get playlist ID from either a URI or URL.
 *
 * @returns {string} The playlist ID.
 */
const getPlaylistId = () => {
  if (uri.includes('spotify:playlist:')) return uri.split(':')[2];
  if (uri.includes('https://open.spotify.com/playlist/')) return uri.split('?')[0].split('/').pop();

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
 * @param {string} outFileName - Playlist name.
 * @param {Object[]} tracks - The track list.
 */
const writeFile = (outFileName, tracks) => {
  if (outType.includes('json')) {
    fs.writeFileSync(outFileName, JSON.stringify(getTrackListJson(tracks), null, 2), 'utf8');
    return;
  }

  if (outType.includes('csv')) {
    fs.writeFileSync(`${outFileName}`, getTrackListCsv(tracks), 'utf8');
    return;
  }

  fs.writeFileSync(`${outFileName}`, getTrackListString(tracks), 'utf8');
};

/**
 * The main function.
 */
const main = async () => {
  if (!outType) throw new Error('$ node src/index.js $uri [json|txt|csv]');

  const token = await getAccessToken();
  const id = getPlaylistId();
  const tracks = await getPlaylistTracks(id, token);
  const { name } = await getPlaylistData(id, token);

  const outName = name
    .split(' ').join('/')
    .split('\'').join('')
    .split(',').join('')
    .split('/').join('-');
  const outFileName = `${outName}.${outType}`;

  writeFile(outFileName, tracks);
  console.log(`Wrote ${outFileName}`);
};

main();
