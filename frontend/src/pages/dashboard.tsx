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
  Spinner,
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

  useEffect(() => {
    console.log(isPlaying);
  }, []);

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
      backgroundColor={"#000000"}
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
              background="linear-gradient(176deg, #3d2346a2 0%, #000000 100%)"
            >
              <VStack
                w={"100%"}
                marginTop={"10px"}
                justifyContent={"space-evenly"}
              >
                <Text color={"#ffffff"} fontSize={"20px"} marginBottom={"20px"}>
                  Your playlist
                </Text>
              </VStack>

              <PlaylistComponent
                playlists={playlists}
                setClickedMusic={setClickedMusic}
              ></PlaylistComponent>
              <VStack
                fontSize={"14px"}
                w={"230px"}
                backgroundColor={"transparent"}
                onClick={() => navigate("/playlist")}
                cursor={"pointer"}
                border={"1px solid #3d2346"}
                color={"#ffffff"}
                boxShadow="#3d2346 0px 5px 15px"
                h={"60px"}
                justifyContent={"center"}
                alignItems={"center"}
                marginBottom={"20px"}
                borderRadius={"4px"}
                _hover={{
                  boxShadow: "#3d2346 0px 10px 30px", // Augmentation du flou et de l'étalement
                  border: "1px solid #3d2346b7",
                }}
              >
                <Text as={"b"}>Manage your playlist</Text>
              </VStack>
              <VStack
                h={"60px"}
                w={"300px"}
                fontSize={"14px"}
                cursor={"pointer"}
                color={"#ffffff"}
                marginBottom={"40px"}
                backgroundColor={"transparent"}
                onClick={() => navigate("/song")}
                boxShadow="#3d2346 0px 5px 15px"
                borderRadius={"4px"}
                border={"1px solid #3d2346"}
                _hover={{
                  boxShadow: "#3d2346 0px 10px 30px", // Augmentation du flou et de l'étalement
                  border: "1px solid #3d2346b7",
                }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text as={"b"}>Upload a song</Text>
              </VStack>
            </VStack>
          )}
          <VStack
            flex={3}
            h={"100%"}
            borderRadius={"8px"}
            background="linear-gradient(176deg, #3d2346b5 0%, #000000 100%)"
          >
            <VStack
              flexDirection={"row"}
              w={"100%"}
              height={"60px"}
              marginTop={"10px"}
              justifyContent={"center"}
            >
              <Input
                w={"50%"}
                maxW={"400px"}
                h={"50px"}
                focusBorderColor="transparent"
                backgroundColor={"transparent"}
                placeholder="What do you want to listen to?"
                _placeholder={{
                  color: "#ffffff",
                }}
                color={"#ffffff"}
                border={"1px solid transparent"}
                borderBottom={"1px solid #ffffff"}
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
                overflowX={"hidden"}
                overflowY={"hidden"}
              >
                {Object.entries(songs)
                  .filter(
                    ([key, value]) =>
                      key.endsWith(".mp3") && typeof value === "object",
                  )
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .filter(([key, value]) => key.includes(search))
                  .map(([key, value], index) => {
                    const songDetails = value as Song;
                    return (
                      <VStack
                        key={key}
                        w={{ base: "120px", sm: "150px", md: "200px" }}
                        h={{ base: "120px", sm: "150px", md: "200px" }}
                        overflow={"hidden"}
                        borderRadius="8px"
                        m={{ base: "1", sm: "2" }}
                        border="1px solid transparent"
                        cursor="pointer"
                        _hover={{
                          border: "1px solid #ead8ba5f",
                          backgroundColor: "#ead8ba20",
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
                            src={index % 2 === 0 ? "/musics.png" : "/color.png"}
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
            backgroundColor={"#000000"}
            // border={"1px solid #3d2346"}
            minH={"90px"}
            flexDirection={"row"}
          >
            <VStack
              flex={1}
              h={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <VStack w={"90%"} flexDirection={"row"} gap={"10px"}>
                <Image
                  src="/color.png"
                  boxSize={"60px"}
                  borderRadius={"4px"}
                ></Image>
                <Text color={"#ffffff"} margin={"8px"}>
                  {currentPlaying}
                </Text>
              </VStack>
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
                {duration! > 0 && (
                  <Image
                    src={isPlaying ? "/pause.png" : "pb.png"}
                    boxSize={"40px"}
                    onClick={togglePlayPause}
                    cursor={"pointer"}
                  />
                )}
                {duration! === undefined && (
                  <Spinner
                    colorScheme="purple"
                    color="#3d2346"
                    boxSize={"40px"}
                  />
                )}
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
                    colorScheme="purple"
                    h={"8px"}
                    value={
                      duration
                        ? (Math.round(seek) * 100) / duration
                        : (Math.round(seek) * 100) / 180
                    }
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
                  colorScheme="purple"
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
