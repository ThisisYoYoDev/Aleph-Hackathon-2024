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

export function Song() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileError, setFileError] = useState("");
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
      const response = await axios.post(
        "http://localhost:8000/upload",
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

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Accéder au fichier sélectionné

    if (file) {
      // Appeler uploadFile directement avec le fichier sans lire comme ArrayBuffer
      uploadFile(file);
    }
  };

  const redirectDashboard = () => navigate("/dashboard");

  return (
    <VStack
      w={"100%"}
      backgroundColor={"#333333"}
      h={"100vh"}
      alignItems={"center"}
    >
      <VStack
        w={"100%"}
        h={"60px"}
        backgroundColor={"orange"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexDirection={"row"}
        gap={"40px"}
      >
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            marginLeft={"20px"}
            border={"1px solid #3d3d3d"}
          />
          <MenuList>
            <MenuItem
              icon={<CalendarIcon />}
              command="⌘T"
              onClick={redirectDashboard}
            >
              Dashboard
            </MenuItem>
            <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
              New Window
            </MenuItem>
            <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
              Open Closed Tab
            </MenuItem>
          </MenuList>
        </Menu>
        <Text fontSize={"20px"}>Vibedefy</Text>
      </VStack>
      <VStack
        w={"500px"}
        h={"500px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          as="label"
          cursor="pointer"
          backgroundColor={"#ffa500"}
          color={"#ffffff"}
          size="lg"
          _hover={{
            backgroundColor: "#ffa60080",
          }}
        >
          Upload your song you want to listen
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
