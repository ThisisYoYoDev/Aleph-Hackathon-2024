import { HStack, Input, VStack, Text, Button } from "@chakra-ui/react";
import React from "react";

function App() {
  return (
    <VStack flexDirection={"column"}>
      <HStack flexDirection={"column"}>
        <VStack alignItems={"flex-start"}>
          <Text>Input test</Text>
          <Input placeholder="Input test"></Input>
        </VStack>
        <Button>Button test</Button>
      </HStack>
    </VStack>
  );
}

export default App;
