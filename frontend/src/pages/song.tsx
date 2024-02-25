/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  VStack,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  HamburgerIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENV_VAR } from "../utils/env";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export function Song() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const toast = useToast();
  const uploadFile = async (file: any) => {
    // Vérifiez si la taille du fichier dépasse 1 Mo
    if (file.size > 1048576) {
      // 1 Mo = 1 048 576 octets
      toast({
        title: "Échec de l'upload",
        description: "La taille du fichier ne doit pas dépasser 1 Mo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Stoppez l'exécution si le fichier est trop grand
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      console.log(ENV_VAR.BACKEND_URL);
      const response = await axios.post(
        `${ENV_VAR.BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response);
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier", error);
      toast({
        title: "Upload failed",
        description: "There was a problem with your upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0]; // Accéder au fichier sélectionné

    if (file) {
      // Appeler uploadFile directement avec le fichier sans lire comme ArrayBuffer
      setIsLoading(true);
      const hash = await uploadFile(file);
      setIsLoading(false);

      const data = localStorage.getItem("uploaded");
      if (data) {
        localStorage.setItem(
          "uploaded",
          JSON.stringify([
            ...JSON.parse(data),
            { name: file.name, item_hash: hash[0].item_hash },
          ]),
        );
      } else {
        localStorage.setItem(
          "uploaded",
          JSON.stringify([{ name: file.name, item_hash: hash[0].item_hash }]),
        );
      }
    }
  };

  const redirectDashboard = () => navigate("/dashboard");

  return (
    <VStack
      w={"100%"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={"#000000"}
    >
      <VStack
        background="linear-gradient(176deg, #3d2346b5 0%, #000000 100%)"
        w={"calc(100% - 16px)"}
        h={"calc(100% - 16px)"}
        margin={"8px"}
        backgroundColor={"#333333"}
        border={"1px solid #ead8ba5f"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <VStack position={"fixed"} top={"80px"} left={"100px"}>
          <ChevronLeftIcon
            boxSize={"40px"}
            color={"#ead8ba5f"}
            cursor={"pointer"}
            onClick={() => navigate("/dashboard")}
            _hover={{ color: "#ffffff" }}
          />
        </VStack>

        <Button
          size="lg"
          h={"60px"}
          as="label"
          w={"500px"}
          cursor="pointer"
          color={"#ffffff"}
          border={"1px solid #3d2346b5"}
          backgroundColor={"transparent"}
          boxShadow="#3d2346 0px 5px 15px"
          _hover={{
            backgroundColor: "#3d2346b5",
          }}
        >
          Upload your song you want to listen
          {isLoading ? <Spinner marginLeft={5} /> : <></>}
          <Input
            type="file"
            accept=".mp3"
            h={"60px"}
            onChange={handleFileChange}
            opacity={0}
            position="absolute"
            left={0}
            top={0}
            width="100%"
            cursor="pointer"
          />
        </Button>
      </VStack>
    </VStack>
  );
}
