/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { HStack, VStack, Text, Input, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    ethereum: any;
  }
}

export function Login() {
  const navigate = useNavigate();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [] };
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));
    };
    getProvider();
  }, []);

  const updateWallet = async (accounts: any) => {
    setWallet({ accounts });
  };

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);

    if (accounts !== undefined || accounts !== null) navigate("/dashboard");
  };

  return (
    <VStack
      justifyContent={"center"}
      height={"100vh"}
      w={"100%"}
      alignItems={"center"}
      backgroundColor={"#262626"}
    >
      <HStack>
        <VStack
          w={"600px"}
          height={"500px"}
          backgroundColor={"#1E1E1E"}
          borderRadius={"8px"}
        >
          <Text
            color={"#ffffff"}
            as={"b"}
            fontSize={"3xl"}
            marginTop={"12px"}
            marginBottom={"60px"}
          >
            Login to VibeDefy
          </Text>
          <VStack w={"400px"} alignItems={"flex-start"} marginBottom={"40px"}>
            <Text color={"#ffffff"} fontSize={"xl"} as={"b"}>
              Hash
            </Text>
            <Input
              height={"60px"}
              color={"#ffffff"}
              focusBorderColor="#000000"
              placeholder="Enter your information..."
              _hover={{
                border: "2px solid #ffffff",
              }}
              _focus={{
                border: "2px solid #7e1bcc",
              }}
            />
          </VStack>
          <VStack
            w={"200px"}
            h={"60px"}
            border={"1px solid orange"}
            borderRadius={"8px"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: "#7a59233a",
            }}
            marginBottom={"20px"}
            onClick={handleConnect}
          >
            <Image src="/metamask.png" boxSize={"50px"} />
          </VStack>
          <Button
            w={"300px"}
            h={"60px"}
            fontSize={"xl"}
            backgroundColor={"orange"}
            color={"#ffffff"}
          >
            Register
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
}
