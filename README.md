# spotify-playlist-export

Node.js script to export a Spotify playlist to a text file, either a track list
or as JSON or CSV data.

Amazingly there's no way to do this from the Spotify app or any of its current
export formats (URIs or playlist URLs), so I created one.


## Install

1. `git clone` this repo.
2. `npm ci`
3. Get Client ID and Client Secret by creating a basic
   [Spotify Application](https://developer.spotify.com/dashboard/applications).


## Usage

Export your credentials:

```
export CLIENT_ID=...
export CLIENT_SECRET=...
```


### Text File

Then do the export, specifying the playlist URL or URL (from the Spotify share
UI):

```
npm start spotify:playlist:595cY5S1FpMpiEIWsk6dG7 playlist.txt
```

The result will be a nicely printed list of track names, artists, and albums.

```
1 Queen - Bohemian Rhapsody (Bohemian Rhapsody (The Original Soundtrack))
2 Queen - Don't Stop Me Now - Remastered (Jazz (Deluxe Remastered Version))
3 Queen - You're My Best Friend - Remastered 2011 (A Night At The Opera (Deluxe Remastered Version))
```


### JSON File

If the output path name contains `json`, data is written instead:

```
npm start spotify:playlist:595cY5S1FpMpiEIWsk6dG7 playlist.json
```

```
[
  {
    "number": 1,
    "name": "Bohemian Rhapsody",
    "artist": "Queen",
    "album": "Bohemian Rhapsody (The Original Soundtrack)"
  },
  {
    "number": 2,
    "name": "Don't Stop Me Now - Remastered",
    "artist": "Queen",
    "album": "Jazz (Deluxe Remastered Version)"
  },
  {
    "number": 3,
    "name": "You're My Best Friend - Remastered 2011",
    "artist": "Queen",
    "album": "A Night At The Opera (Deluxe Remastered Version)"
  },

  ...
]
```

### CSV File

If the output path name contains `csv`, CSV data is written instead:

```
npm start spotify:playlist:595cY5S1FpMpiEIWsk6dG7 playlist.csv
```

```
Number,Name,Artist,Album
1,Bohemian Rhapsody,Queen,Bohemian Rhapsody (The Original Soundtrack)
2,Don't Stop Me Now - Remastered,Queen,Jazz (Deluxe Remastered Version)
3,You're My Best Friend - Remastered 2011,Queen,A Night At The Opera (Deluxe Remastered Version)
```
