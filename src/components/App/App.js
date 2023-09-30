import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";
import LoadingScreen from "../Loading/Loading";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isSavingPlaylist, setIsSavingPlaylist] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const storedPlaylist = localStorage.getItem("playlist");
    if (storedPlaylist) {
      const parsedPlaylist = JSON.parse(storedPlaylist);
      setPlaylistName(parsedPlaylist.playlistName);
      setPlaylistTracks(parsedPlaylist.playlistTracks);
    }
  }, []);

  useEffect(() => {
    Spotify.getPlaylists()
      .then((playlists) => {
        setUserPlaylists(playlists);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  }, []);

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
       // Save the updated playlist to local storage
       const updatedPlaylistData = {
        playlistName,
        playlistTracks: [...playlistTracks, track],
      };
      localStorage.setItem("playlist", JSON.stringify(updatedPlaylistData));
    },
    [playlistName, playlistTracks]
  );

  const removeTrack = useCallback(
    (track) => {
      // Remove the track from the playlist in component state
      setPlaylistTracks((prevTracks) =>
        prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
      );

      // Save the updated playlist to local storage
      const updatedPlaylistData = {
        playlistName,
        playlistTracks: playlistTracks.filter(
          (currentTrack) => currentTrack.id !== track.id
        ),
      };
      localStorage.setItem("playlist", JSON.stringify(updatedPlaylistData));
    },
    [playlistName, playlistTracks]
  );

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    setIsSavingPlaylist(true); // Set saving state to true
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      localStorage.removeItem("playlist");
    })
    .catch((error) => {
      console.error("Error saving playlist:", error);
    })
    .finally(() => {
      setIsSavingPlaylist(false); // Set saving state back to false
    });
  }, [playlistName, playlistTracks]);

  return (
    <div>
      <h1>
        Sym<span className="highlight">phonia</span>
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
        {isSavingPlaylist && <LoadingScreen />}
        <div className="ExistingPlaylists">
        <div className="UserPlaylists">
        <h2 className="user">Your Playlists</h2>
        <ul className="user-list">
          {userPlaylists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </div>
      </div>
      </div>
    </div>
  );
};

export default App;
