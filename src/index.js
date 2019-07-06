const fs = require('fs');
const spotify = require('./modules/spotify');

const [arg] = process.argv.slice(2);

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
 * The main function.
 */
const main = async () => {
  const token = await spotify.getAccessToken();
  const tracks = await spotify.getPlaylistTracks(getPlaylistId(), token);

  tracks.forEach((track, i) => {
    // Print the data we actually want for further processing
    const info = `\n${i + 1}. ${track.name} - ${track.artists[0].name} (${track.album.name})`;
    console.log(info);
  });
  console.log();
};

main();
