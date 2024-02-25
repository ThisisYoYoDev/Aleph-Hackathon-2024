/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import useLocalStorage from "../utils/localStorage";
import {
  Button,
  Input,
  VStack,
  Text,
  Select,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Song } from "./dashboard";

export interface Music {
  title: string;
  artist?: string;
}

export interface Playlist {
  id: string;
  name: string;
  musics: Music[];
}

const PlaylistManager = (songs: any, playlistSearch: string) => {
  // Initialiser la playlist stockée dans le localStorage
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>(
    "myPlaylists",
    [],
  );

  // States pour la nouvelle playlist et la nouvelle musique
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newMusic, setNewMusic] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  // Ajouter une nouvelle playlist
  const addPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      musics: [],
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  // Ajouter une musique à une playlist existante
  const addMusicToPlaylist = (playlistId: string, newMusic: Music) => {
    setPlaylists((currentPlaylists) => {
      return currentPlaylists.map((playlist) => {
        if (playlist.id === playlistId) {
          // Assurez-vous que 'musics' contient uniquement des objets de type 'Music'
          return { ...playlist, musics: [...playlist.musics, newMusic] };
        }
        return playlist;
      });
    });
  };

  return (
    <VStack w={"80%"}>
      <Input
        type="text"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        placeholder="Nom de la nouvelle playlist"
        color={"#ffffff"}
      />
      <Button onClick={() => addPlaylist(newPlaylistName)}>
        Ajouter Playlist
      </Button>

      <Select
        onChange={(e) => setSelectedPlaylistId(e.target.value)}
        value={selectedPlaylistId}
        color={"#ffffff"}
      >
        <option value="">Sélectionnez une Playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => setNewMusic(e.target.value)} color={"#ffffff"}>
        <option value="">Sélectionnez une musique</option>
        {Object.entries(songs.songs) // Accéder à la sous-structure 'songs'
          .filter(
            ([key, value]) => key.endsWith(".mp3") && typeof value === "object",
          ) // Filtrer pour les fichiers .mp3 qui sont des objets
          .map(([key, value]) => {
            // Ici, 'key' est le nom du fichier, et 'value' est l'objet contenant 'cid' et 'item_hash'
            // Vous pouvez ajuster le texte de l'option si nécessaire pour le rendre plus lisible
            const readableTitle = key.replace(/_/g, " ").replace(".mp3", ""); // Exemple de transformation simple du nom de fichier
            return (
              <option key={key} value={key} color={"#ffffff"}>
                {readableTitle}
              </option>
            );
          })}
      </Select>

      <Button
        onClick={() => {
          const musicToAdd = { title: newMusic }; // Ajustez selon vos besoins
          if (selectedPlaylistId) {
            addMusicToPlaylist(selectedPlaylistId, musicToAdd);
          }
        }}
        disabled={!selectedPlaylistId || !newMusic}
      >
        Ajouter Musique
      </Button>

      {playlists.map((playlist) => (
        <VStack key={playlist.id}>
          <Text color={"#ffffff"}>{playlist.name}</Text>
          {playlist.musics.map((music, index) => (
            <UnorderedList>
              <ListItem color={"#ffffff"}>{music.title}</ListItem>
            </UnorderedList>
          ))}
        </VStack>
      ))}
    </VStack>
  );
};

export default PlaylistManager;
