import { VStack } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import PlaylistManager from "./test";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV_VAR } from "../utils/env";

export function Playlist() {
  const [songs, setSong] = useState([]);
  const navigate = useNavigate();

  const getPlaylists = async () => {
    const { songs } = (await axios.get(`${ENV_VAR.BACKEND_URL}/song_list`))
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
      backgroundColor={"#000000"}
    >
      <VStack
        background="linear-gradient(176deg, #3d2346b5 0%, #000000 100%)"
        w={"calc(100% - 16px)"}
        h={"calc(100% - 16px)"}
        margin={"8px"}
        backgroundColor={"#333333"}
        border={"1px solid #ead8ba5f"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <VStack alignItems={"flex-start"} w={"500px"}>
          <ChevronLeftIcon
            boxSize={"40px"}
            color={"#ead8ba5f"}
            cursor={"pointer"}
            onClick={() => navigate("/dashboard")}
            _hover={{ color: "#ffffff" }}
          />
        </VStack>
        <VStack w={"500px"} h={"500px"}>
          <PlaylistManager songs={songs} playlistSearch={""} />
        </VStack>
      </VStack>
    </VStack>
  );
}
