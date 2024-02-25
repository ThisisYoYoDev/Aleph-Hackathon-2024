import axios from "axios";
import {
  VStack,
  Text,
  Input,
  Box,
  Progress,
  Stack,
  Image,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAudioPlayer } from "../utils/sound";
import PlaylistManager from "./test";

export interface Song {
  cid: string;
  item_hash: string;
}

export function Dashboard() {
  const [isMusicSelected, setIsMusicSelected] = useState<boolean>(false);
  const [songs, setSong] = useState([]);
  const [CID, setCID] = useState<string>("");
  const [currentPlaying, setCurrentPlaying] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playlistSearch, setPlaylistSearch] = useState<string>("");
  const { isPlaying, togglePlayPause, seek, duration, setVolume, reStart } =
    useAudioPlayer({
      url: `https://ipfs.aleph.im/ipfs/${CID}`,
    });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSearch = (search: any) => {
    setSearch(search);
  };

  const getPlaylists = async () => {
    const { songs } = (await axios.get(`http://localhost:8000/song_list`)).data;
    setSong(songs);
    console.log(Object.entries(songs)[5][0]);
  };

  const handleVStackClick = (cid: string, key: string) => {
    console.log("CID clicked:", cid);
    setCID(cid);
    setCurrentPlaying(key);
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <VStack
      h={"100vh"}
      w={"100vw"}
      backgroundColor={"#1b1b1b"}
      justifyContent={"center"}
      overflow="hidden"
    >
      <VStack
        w={"calc(100% - 16px)"}
        h={"calc(100% - 16px)"}
        borderRadius={"8px"}
      >
        <VStack flexDirection={"row"} w={"100%"} h={"100%"}>
          <VStack
            flex={1}
            h={"100%"}
            borderRadius={"8px"}
            backgroundColor={"#333333"}
            border={"1px solid #fd923460"}
          >
            <VStack
              w={"100%"}
              marginTop={"10px"}
              flexDirection={"row"}
              justifyContent={"space-evenly"}
            >
              <Text color={"#ffffff"} fontSize={"20px"}>
                Your playlist
              </Text>
            </VStack>
            <PlaylistManager songs={songs} playlistSearch={playlistSearch} />
          </VStack>
          <VStack
            flex={3}
            h={"100%"}
            borderRadius={"8px"}
            backgroundColor={"#333333"}
            border={"1px solid #fd923460"}
          >
            <VStack
              flexDirection={"row"}
              w={"100%"}
              height={"60px"}
              marginTop={"10px"}
              gap={"200px"}
            >
              <VStack
                w={"50px"}
                h={"50px"}
                backgroundColor={"orange"}
                borderRadius={"100px"}
                justifyContent={"center"}
                marginLeft={"30px"}
                cursor={"pointer"}
              >
                <Text color={"#ffffff"} as={"b"} fontSize={"16px"}>
                  N
                </Text>
              </VStack>
              <Input
                w={"500px"}
                h={"50px"}
                focusBorderColor="transparent"
                backgroundColor={"#4E4E4E"}
                placeholder="What do you want to listen to?"
                color={"#ffffff"}
                _hover={{
                  border: "1px solid #ffffff",
                }}
                _focus={{
                  border: "1px solid orange",
                }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </VStack>

            {/* Object VStack Container */}
            <Box
              w={"100%"}
              h={"100%"}
              flex={1}
              marginTop={"120px"}
              overflow={"hidden"}
            >
              <VStack
                w={"100%"}
                paddingY={"4"}
                maxH={"610px"}
                h={"auto"}
                flexWrap={"wrap"}
                gap={"20px"}
              >
                {Object.entries(songs)
                  .filter(
                    ([key, value]) =>
                      key.endsWith(".mp3") && typeof value === "object",
                  )
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .filter(([key, value]) => key.includes(search))
                  .map(([key, value]) => {
                    const songDetails = value as Song;
                    return (
                      <VStack
                        key={key}
                        w="200px"
                        h="200px"
                        backgroundColor="#4E4E4E"
                        borderRadius="8px"
                        m="2"
                        border="1px solid transparent"
                        boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                        cursor="pointer"
                        _hover={{
                          border: "1px solid orange",
                        }}
                        onClick={() => {
                          handleVStackClick(songDetails.cid, key);
                          setIsMusicSelected(true);
                        }}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Text color="#ffffff" margin={"8px"}>
                          {key}
                        </Text>
                      </VStack>
                    );
                  })}
              </VStack>
            </Box>
          </VStack>
        </VStack>
        {isMusicSelected && (
          <VStack
            h={"90px"}
            w={"100%"}
            borderRadius={"8px"}
            backgroundColor={"#333333"}
            border={"1px solid #fd923460"}
            minH={"90px"}
            flexDirection={"row"}
          >
            <VStack
              flex={1}
              h={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text color={"#ffffff"} margin={"8px"}>
                {currentPlaying}
              </Text>
            </VStack>
            <VStack flex={3} h={"100%"}>
              <VStack
                w={"100%"}
                h={"80%"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={"60px"}
                marginTop={"8px"}
              >
                <Image
                  src="/nextr.png"
                  boxSize={"20px"}
                  cursor={"pointer"}
                  onClick={reStart}
                />
                <Image
                  src={isPlaying ? "/pause.png" : "pb.png"}
                  boxSize={"40px"}
                  onClick={togglePlayPause}
                  cursor={"pointer"}
                />
                <Image src="/nextl.png" boxSize={"20px"} cursor={"pointer"} />
              </VStack>
              <VStack
                flexDirection={"row"}
                h={"100%"}
                w={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
              >
                <Text
                  color={"#ffffff"}
                  marginBottom={"12px"}
                >{`${formatTime(Math.round(seek))}`}</Text>
                <Stack spacing={5} w={"60%"} h={"20px"}>
                  <Progress
                    colorScheme="orange"
                    h={"8px"}
                    value={(Math.round(seek) * 100) / 186}
                    borderRadius={"8px"}
                  />
                </Stack>
                <Text color={"#ffffff"} marginBottom={"12px"}>
                  {duration ? formatTime(Math.round(duration)) : " ~ "}
                </Text>
              </VStack>
            </VStack>
            <VStack flex={1} h={"100%"}>
              <VStack
                justifyContent={"center"}
                align={"center"}
                flexDirection={"row"}
                h={"100%"}
                w={"100%"}
                marginLeft={"100px"}
              >
                <Image src="/volume.png" boxSize={"30px"}></Image>
                <Slider
                  aria-label="slider-ex-1"
                  defaultValue={30}
                  w={"40%"}
                  colorScheme="orange"
                  onChange={setVolume}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </VStack>
            </VStack>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
