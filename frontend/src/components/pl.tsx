/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, SetStateAction, useState } from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import { Playlist } from "../pages/test";

interface VotreComposantProps {
  playlists: Playlist[];
  setClickedMusic: Dispatch<SetStateAction<string>>;
}

export const PlaylistComponent: React.FC<VotreComposantProps> = ({
  playlists,
  setClickedMusic,
}) => {
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState<
    number | null
  >(null);

  const handlePlaylistClick = (index: number) => {
    if (selectedPlaylistIndex === index) {
      setSelectedPlaylistIndex(null);
    } else {
      setSelectedPlaylistIndex(index);
    }
  };

  return (
    <VStack w={"90%"} h={"100%"}>
      {playlists
        .filter(
          (playlist: { name: string | any[] }) => playlist.name.length > 1,
        )
        .map(
          (
            playlist: {
              name: string;
              musics: any[];
            },
            index: number,
          ) => (
            <VStack key={index} gap={"20px"} overflow={"hidden"}>
              <Box
                flex="1"
                textAlign="left"
                onClick={() => handlePlaylistClick(index)}
                cursor={"pointer"}
              >
                <Text
                  color={"#ffffff86"}
                  _hover={{
                    color: "#ffffffbd",
                  }}
                >
                  {playlist.name}
                </Text>
              </Box>
              {selectedPlaylistIndex === index && (
                <VStack alignItems={"flex-start"} gap={"10px"}>
                  {playlist.musics.length < 1 && (
                    <Text color={"#ffffff86"}>
                      Add music in this playlist...
                    </Text>
                  )}
                  {playlist.musics.map(
                    (
                      music: {
                        title: string;
                        cid: string;
                      },
                      musicIndex: React.Key | null | undefined,
                    ) => (
                      <Text
                        key={musicIndex}
                        color={"#ffffff"}
                        cursor={"pointer"}
                        onClick={() => setClickedMusic(music.title)}
                      >
                        {music.title}
                      </Text>
                    ),
                  )}
                </VStack>
              )}
            </VStack>
          ),
        )}
    </VStack>
  );
};
