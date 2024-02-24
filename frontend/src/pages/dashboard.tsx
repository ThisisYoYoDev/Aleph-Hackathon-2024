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
import { useState } from "react";

export function Dashboard() {
  const [isMusicSelected, setIsMusicSelected] = useState<boolean>(false);

  const playMusic = () => setIsMusicSelected(true);

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
              <Text color={"orange"} fontSize={"40px"} cursor={"pointer"}>
                +
              </Text>
            </VStack>
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
                backgroundColor={"#4E4E4E"}
                placeholder="What do you want to listen to?"
                color={"#ffffff"}
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
                {[...Array(8)].map((_, i) => (
                  <VStack
                    key={i}
                    w="200px"
                    h="200px"
                    backgroundColor="#4E4E4E"
                    borderRadius={"8px"}
                    m="2"
                    border={"1px solid transparent"}
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                    cursor={"pointer"}
                    _hover={{
                      border: "1px solid orange",
                    }}
                    onClick={playMusic}
                  >
                    <Text color="#ffffff">Item {i}</Text>
                  </VStack>
                ))}
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
            <VStack flex={1} h={"100%"} backgroundColor={"red"}>
              head icon
            </VStack>
            <VStack flex={3} h={"100%"}>
              <VStack
                w={"100%"}
                h={"80%"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={"60px"}
              >
                <Image src="/nextr.png" boxSize={"30px"} />
                <Image src="/pause.png" boxSize={"50px"} />
                <Image src="/nextl.png" boxSize={"30px"} />
              </VStack>
              <Stack spacing={5} w={"100%"} h={"20px"}>
                <Progress
                  colorScheme="orange"
                  size="sm"
                  value={50}
                  borderRadius={"8px"}
                />
              </Stack>
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
