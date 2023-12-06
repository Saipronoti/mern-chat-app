import { Box, Text} from "@chakra-ui/layout";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { useEffect,useState } from "react";
import { Spinner, FormControl, Input } from "@chakra-ui/react";
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import "./styles.css";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState([]); // state to store messages received from backend
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return; //no chat selected

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );

            console.log(messages);
            setMessages(data); //set data inside state
            setLoading(false);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);// when user changes chat call fetch messages again

    const sendMessage = async(event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                console.log(data);

                setNewMessage("");
                setMessages([...messages, data]);// appending latest message to existing message
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, []);
    
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        //typing indicator logic
     };

  return (
      <>
          {selectedChat ? (
              <>
                  <Text
                      fontSize={{ base: "28px", md: "30px" }}
                      pb={3}
                      px={2}
                      w="100%"
                      fontFamily="Work sans"
                      d="flex"
                      justifyContent={{ base: "space-between" }}
                      alignItems="center"
                  >
                      <IconButton
                          d={{ base: "flex", md: "none " }}
                          icon={<ArrowBackIcon />}
                          onClick={() => setSelectedChat("")}
                      />
                      {!selectedChat.isGroupChat ? (
                          <>{getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                          </>
                      ) : (
                              <>
                                  {selectedChat.chatName.toUpperCase()}
                                  {  <UpdateGroupChatModal
                                      fetchAgain={fetchAgain}
                                      setFetchAgain={setFetchAgain}
                                      fetchMessages={fetchMessages}
                      /> }
                            </>          
                      )}
                  </Text>
                  <Box
                     d="flex"
                     flexDir="column"
                     justifyContent="flex-end"
                     p={3}
                     bg="#E8E8E8"
                     w="100%"
                     h="300%"
                     borderRadius="lg"
                     overflowY="hidden"
                  >
                      {loading ? (
                          <Spinner
                              size="xl"
                              w={20}
                              h={20}
                              alignSelf="center"
                              margin="auto"
                          />
                      ) : (
                              <div className="messages">
                                <ScrollableChat messages={messages} />
                                  {/* Messages here */}</div>        
                      )}  
                      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                          <Input
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder="Enter a message .."
                              onChange={typingHandler}
                              value={newMessage}
                          /> 
                      </FormControl>      
          </Box>
              </>
          ) : (
                  <Box d="flex" alignItems="center" justifyContent="center" h="100%" >
                      <Text fontSize="3xl" pb={3} fontFamily="Work sans" >
                          Click on a user to start chatting
                      </Text>   
                 </Box>
          )}
      </>
  );
};

export default SingleChat;