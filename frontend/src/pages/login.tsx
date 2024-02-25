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
    console.log(accounts);

    if (accounts !== undefined || accounts !== null) navigate("/dashboard");
  };

  return (
    <VStack
      justifyContent={"center"}
      height={"100vh"}
      w={"100%"}
      alignItems={"center"}
      backgroundColor={"#000000"}
      background="linear-gradient(176deg, #3d2346b5 0%, #000000 100%)"
    >
      <HStack>
        <VStack
          w={"600px"}
          height={"500px"}
          backgroundColor={"#1e1e1e56"}
          borderRadius={"8px"}
        >
          <Text
            color={"#ffffff"}
            as={"b"}
            fontSize={"3xl"}
            marginTop={"12px"}
            marginBottom={"60px"}
          >
            Login to Vibeefy
          </Text>
          <VStack
            w={"400px"}
            alignItems={"flex-start"}
            marginBottom={"40px"}
          ></VStack>
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
            backgroundColor={"#67317ab5"}
            color={"#ffffff"}
            onClick={() => navigate("/dashboard")}
          >
            Register
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
}
