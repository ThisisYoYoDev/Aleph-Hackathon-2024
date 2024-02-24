import {
  VStack,
  Input,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  HamburgerIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export function Song() {
  const [fileError, setFileError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // 1MB = 1 * 1024 * 1024 bytes
      if (file.size > 1 * 1024 * 1024) {
        setFileError("La taille du fichier doit être inférieure à 1MB.");
      } else {
        setFileError("");
        // Traitement du fichier ici
      }
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
        justifyContent={"center"}
        alignItems={"flex-start"}
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
      </VStack>
      <VStack
        w={"500px"}
        h={"500px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Input
          type="file"
          accept=".mp3"
          h={"60px"}
          alignSelf={"center"}
          onChange={handleFileChange}
          justifyContent={"center"}
          color={"#ffffff"}
        />
        {fileError && <Text color="red">{fileError}</Text>}
      </VStack>
    </VStack>
  );
}
