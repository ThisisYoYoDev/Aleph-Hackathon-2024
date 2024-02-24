import { VStack, HStack, Text, Input } from "@chakra-ui/react";

export function Register() {
  return (
    <VStack
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={"#1b1b1b"}
    >
      <HStack>
        <VStack
          w={"600px"}
          height={"500px"}
          backgroundColor={"#3d3d3d"}
          borderRadius={"8px"}
        >
          <Text color={"#ffffff"} fontSize={"2xl"} as={"b"} margin={"12px"}>
            Register to our app
          </Text>

          <VStack alignItems={"flex-start"} justifyContent={"center"}>
            <Text color={"#ffffff"} fontSize={"xl"} as={"b"}>
              Hash
            </Text>
            <Input
              placeholder="Enter your hash"
              w={"400px"}
              padding={"28px"}
              color={"#fffff"}
              colorScheme="#ffffff"
            />
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
