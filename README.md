# spotify-uri-export

Node.js script to export a Spotify playlist from a list of URIs.

Amazingly there's no way to do this from the Spotify app or any of its current
export formats (URIs or playlist URLs).


## Install

1. `git clone` this repo.
2. `npm i`
3. Get Client ID and Client Secret by creating a basic
   [Spotify Application](https://developer.spotify.com/dashboard/applications).


## Usage

1. Open the playlist to export as track details.
2. Select all (Cmd - A or Ctrl - A) and copy (Cmd - C or Ctrl - C).
3. Paste the content into a file, such as `track-uris.txt`:

```
https://open.spotify.com/track/2JoUtztTqCN4ZhmbRDGPIL
https://open.spotify.com/track/6Zyz8lsnMFpIrCTuvGurCB
https://open.spotify.com/track/5TDZyWDfbQFQJabbPwImVY
https://open.spotify.com/track/2cWHN0WK52RGAWHgaDamUA
https://open.spotify.com/track/54eZmuggBFJbV7k248bTTt
```

Export your credentials:

```
export CLIENT_ID=...
export CLIENT_SECRET=...
```

Then do the export with this tool:

4. `node src/index.js ./track-uris.txt`

The result will be a nicely printed list of track names, artists, and albums.

```
1. Songbird - 2004 Remaster - Fleetwood Mac (Rumours)

2. New Kid in Town - 2013 Remaster - Eagles (Hotel California (2013 Remaster))

3. Dreams - 2004 Remaster - Fleetwood Mac (Rumours)

4. Take It to the Limit - 2013 Remaster - Eagles (One of These Nights (2013 Remaster))

5. A Horse with No Name - America (America)
```

Feel free to redirect to a file:

```
node src/index.js ./track-uris.txt > track-list.txt
```

@Spotify - 'Power User' or rarely used features can be useful!
