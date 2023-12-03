import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from "../../Context/ChatProvider";
import  UserBadgeItem  from "../userAvatar/UserBadgeItem";

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();
    const handleRemoveFromGroup = () => {};
    return (
    <>
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
                    <ModalBody>
                        {selectedChat.users.map((u) => (
                           <UserBadgeItem
                           key={u._id}
                           user={u}
                           handleFunction={() => handleRemoveFromGroup(u)}
                />
                       ))} 
                   </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default UpdateGroupChatModal
