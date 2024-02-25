import { VStack } from "@chakra-ui/react";
import PlaylistManager from "./test";
import axios from "axios";
import { useEffect, useState } from "react";
import { ENV_VAR } from "../utils/env";

export function Playlist() {
  const [songs, setSong] = useState([]);

  const getPlaylists = async () => {
    const { songs } = (await axios.get(`$${ENV_VAR.BACKEND_URL}/song_list`))
      .data;
    setSong(songs);
    console.log(Object.entries(songs)[5][0]);
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <VStack
      w={"100%"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={"#1b1b1b"}
    >
      <VStack
        w={"calc(100% - 16px)"}
        h={"calc(100% - 16px)"}
        margin={"8px"}
        backgroundColor={"#333333"}
        border={"1px solid orange"}
      >
        <PlaylistManager songs={songs} playlistSearch={""} />
      </VStack>
    </VStack>
  );
}
