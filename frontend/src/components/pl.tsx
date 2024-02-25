/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, SetStateAction, useState } from "react";
import { VStack, Box, Text, Image, Tooltip } from "@chakra-ui/react";
import { Playlist } from "../pages/test";
import { useNavigate } from "react-router-dom";

interface VotreComposantProps {
  playlists: Playlist[];
  setClickedMusic: Dispatch<SetStateAction<string>>;
}

export const PlaylistComponent: React.FC<VotreComposantProps> = ({
  playlists,
  setClickedMusic,
}) => {
  const navigate = useNavigate();
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
            <VStack
              key={index}
              gap={"20px"}
              w={"80%"}
              overflow={"hidden"}
              backgroundColor={"transparent"}
              padding={"12px"}
              borderRadius={"8px"}
              cursor={"pointer"}
              border={"1px solid transparent"}
              _hover={{
                border: "1px solid #ead8ba5f",
                backgroundColor: "#ead8ba20",
              }}
              onClick={() => handlePlaylistClick(index)}
            >
              <Box flex="1" textAlign="left" cursor={"pointer"}>
                <VStack flexDirection={"row"} gap={"20px"}>
                  <Image
                    src="/plicon.png"
                    boxSize={"40px"}
                    borderRadius={"20px"}
                  />
                  <Text color={"#ffffff"}>{playlist.name}</Text>
                </VStack>
              </Box>
              {selectedPlaylistIndex === index && (
                <VStack alignItems={"flex-start"} gap={"10px"}>
                  {playlist.musics.length < 1 && (
                    <Text
                      color={"#ffffff86"}
                      onClick={() => navigate("/playlist")}
                    >
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
                      <Tooltip label="Play me!" aria-label="A tooltip">
                        <Text
                          color={"#a7a7a7"}
                          _hover={{
                            color: "#ffffff",
                          }}
                          onClick={() => setClickedMusic(music.title)}
                        >
                          {music.title}
                        </Text>
                      </Tooltip>
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
