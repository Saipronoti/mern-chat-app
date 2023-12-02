import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react"
import axios from "axios";
import { ChatState } from '../Context/ChatProvider'

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();
    const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
}

export default MyChats
