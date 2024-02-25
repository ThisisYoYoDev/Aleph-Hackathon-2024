/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAudioPlayer } from "../utils/sound";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../utils/localStorage";
import { Playlist } from "./test";
import { ENV_VAR } from "../utils/env";
import { PlaylistComponent } from "../components/pl";

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
  const { isPlaying, togglePlayPause, seek, duration, setVolume, reStart } =
    useAudioPlayer({
      url: `https://ipfs.aleph.im/ipfs/${CID}`,
    });

  const [clickedMusic, setClickedMusic] = useState<string>("");

  const [isLargerThan1500] = useMediaQuery("(min-width: 1400px)");

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
  };

  function findCidBySongName(songs: any, songName: string): string | null {
    // Parcourir les clés de l'objet songs
    for (const key in songs) {
      console.log(key);
      if (key === songName) {
        // Si le nom de la musique correspond, retourner le cid
        return songs[key].cid;
      }
    }
    // Si aucune musique correspondante n'est trouvée, retourner null
    return null;
  }

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
    const x = findCidBySongName(songs, clickedMusic);
    console.log(x, clickedMusic);
    if (x !== undefined && x !== null) {
      setCID(x);
      setIsMusicSelected(true);
      setCurrentPlaying(clickedMusic);
    }
  }, [clickedMusic]);

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
              border={"1px solid #ead8ba5f"}
            >
              <VStack
                w={"100%"}
                marginTop={"10px"}
                justifyContent={"space-evenly"}
              >
                <Text
                  color={"#ffffff86"}
                  fontSize={"20px"}
                  marginBottom={"20px"}
                >
                  Your playlist
                </Text>
              </VStack>

              <PlaylistComponent
                playlists={playlists}
                setClickedMusic={setClickedMusic}
              ></PlaylistComponent>
              <Button
                fontSize={"14px"}
                w={"200px"}
                backgroundColor={"#ead8ba5f"}
                onClick={() => navigate("/playlist")}
                cursor={"pointer"}
                h={"60px"}
              >
                Add a playlist
              </Button>
              <Button
                fontSize={"14px"}
                w={"300px"}
                backgroundColor={"#ead8ba5f"}
                onClick={() => navigate("/song")}
                cursor={"pointer"}
                marginBottom={"40px"}
                h={"60px"}
              >
                Upload a song
              </Button>
            </VStack>
          )}
          <VStack
            flex={3}
            h={"100%"}
            borderRadius={"8px"}
            backgroundColor={"#333333"}
            border={"1px solid #ead8ba5f"}
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
                backgroundColor={"#ead8ba5f"}
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
                w={"50%"}
                maxW={"400px"}
                h={"50px"}
                focusBorderColor="transparent"
                backgroundColor={"transparent"}
                placeholder="What do you want to listen to?"
                _placeholder={{
                  color: "#ead8ba5f",
                }}
                color={"#ffffff"}
                border={"1px solid transparent"}
                borderBottom={"1px solid #ead8ba5f"}
                _hover={{
                  border: "1px solid #ffffff",
                }}
                _focus={{
                  border: "1px solid #ead8ba5f",
                }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </VStack>

            {/* Object VStack Container */}
            <Box
              w="100%"
              h="80%"
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              overflow="hidden" // Empêche le débordement du contenu
            >
              <VStack
                w="100%"
                maxW={{ base: "85%", sm: "90%", md: "80%", lg: "1200px" }} // Ajuste la largeur max pour les très petits écrans
                paddingY="4"
                // maxH="500px"
                h="auto"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                flexDirection={{ base: "column", sm: "row" }}
                overflow="scroll"
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
                        w={{ base: "120px", sm: "150px", md: "200px" }}
                        h={{ base: "120px", sm: "150px", md: "200px" }}
                        backgroundColor="#4E4E4E"
                        overflow={"hidden"}
                        borderRadius="8px"
                        m={{ base: "1", sm: "2" }}
                        border="1px solid transparent"
                        boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                        cursor="pointer"
                        _hover={{
                          border: "1px solid #ead8ba5f",
                        }}
                        onClick={() => {
                          handleVStackClick(songDetails.cid, key);
                          setIsMusicSelected(true);
                        }}
                        justifyContent="flex-end"
                        textAlign={"center"}
                        alignItems="center"
                      >
                        <VStack
                          flex={1}
                          justifyContent={"center"}
                          height={"100%"}
                          h={"80%"}
                        >
                          <Image
                            src="/musics.png"
                            objectFit="cover"
                            borderRadius={"12px"}
                            w={"90%"}
                            h={"90%"}
                            boxShadow={
                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;"
                            }
                          />
                        </VStack>
                        <VStack flex={1} h={"20%"} overflow={"hidden"}>
                          <Text color="#ffffff" margin="8px" fontSize={"14px"}>
                            {key}
                          </Text>
                        </VStack>
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
            border={"1px solid #ead8ba5f"}
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
                    colorScheme="telegram"
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
                  colorScheme="#ead8ba5f"
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
