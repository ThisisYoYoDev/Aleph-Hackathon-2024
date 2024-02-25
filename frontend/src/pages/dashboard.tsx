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
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAudioPlayer } from "../utils/sound";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../utils/localStorage";
import { Playlist } from "./test";
import { ENV_VAR } from "../utils/env";

export interface Song {
  cid: string;
  item_hash: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [isMusicSelected, setIsMusicSelected] = useState<boolean>(false);
  const [nextSong, setNextSong] = useState<
    { cid: string; name: string } | undefined
  >(undefined);
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

  const [isLargerThan1500] = useMediaQuery("(min-width: 1500px)");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>(
    "myPlaylists",
    [],
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSearch = (search: any) => {
    setSearch(search);
  };

  const getPlaylists = async () => {
    const { songs } = (await axios.get(`${ENV_VAR.BACKEND_URL}/song_list`))
      .data;
    setSong(songs);
    console.log(Object.entries(songs)[5][0]);
  };

  const getNextSong = async () => {
    try {
      const { next_musique } = (
        await axios.get(`${ENV_VAR.BACKEND_URL}/next_music`, {
          params: { last_song: currentPlaying },
        })
      ).data;
      console.log("Next song", next_musique);
      setNextSong({ cid: songs[next_musique]["cid"], name: next_musique });
    } catch (error) {
      console.log("Fail to load next musique");
    }
  };

  const handleVStackClick = (
    cid: string,
    key: string,
    needNextSong: boolean = true,
  ) => {
    console.log("CID clicked:", cid);
    setCID(cid);
    setCurrentPlaying(key);
    if (needNextSong) getNextSong();
  };

  const handleNextSong = () => {
    if (nextSong) {
      handleVStackClick(nextSong.cid, nextSong.name);
      setNextSong(undefined);
    } else {
      // If the ia isn't fast at one point
      const keys = Object.keys(songs);
      const targetKey: any =
        keys[Math.floor((Math.random() * 1000) % keys.length)];
      handleVStackClick(songs[targetKey]["cid"], targetKey, false);
    }
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  useEffect(() => {
    console.log(isLargerThan1500); // Voir la valeur actuelle dans la console
  }, [isLargerThan1500]);

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
          {isLargerThan1500 && (
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
                justifyContent={"space-evenly"}
              >
                <Text
                  color={"#ffffff"}
                  fontSize={"20px"}
                  onClick={() => navigate("/playlist")}
                  marginBottom={"40px"}
                  cursor={"pointer"}
                >
                  Your playlist
                </Text>

                <Accordion allowToggle w={"100%"}>
                  {playlists
                    .filter((playlist) => playlist.name.length > 1)
                    .map((playlist, index) => {
                      return (
                        <AccordionItem key={index}>
                          <AccordionButton
                            _expanded={{ bg: "orange", color: "white" }}
                          >
                            <Box flex="1" textAlign="left">
                              <Text color={"#ffffff"} as={"b"}>
                                {playlist.name}
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack>
                              {playlist.musics.map((music, musicIndex) => (
                                <Text key={musicIndex} color={"#ffffff"}>
                                  {music.title}
                                </Text>
                              ))}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                </Accordion>
              </VStack>
            </VStack>
          )}
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
                <Text
                  color={"#ffffff"}
                  as={"b"}
                  fontSize={"16px"}
                  onClick={() => navigate("/song")}
                >
                  N
                </Text>
              </VStack>
              <Input
                w={"40%"}
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
              w="100%"
              h="100%"
              flex={1}
              marginTop={{ base: "60px", md: "120px" }}
              overflow="scroll"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VStack
                w="100%"
                maxW={{ sm: "90%", md: "80%", lg: "1200px" }}
                paddingY="4"
                maxH="610px"
                h="auto"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                flexDirection={{ base: "column", sm: "row" }}
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
                        w={{ base: "150px", sm: "200px" }}
                        h={{ base: "150px", sm: "200px" }}
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
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text color="#ffffff" margin="8px">
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
                <Image
                  src="/nextl.png"
                  boxSize={nextSong ? "24px" : "20px"}
                  cursor={"pointer"}
                  onClick={handleNextSong}
                />
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
