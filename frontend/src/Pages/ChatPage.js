import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box } from "@chakra-ui/layout";
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';

//in box we add chats if user is logged in
const ChatPage = () => {
    const { user } = ChatState();
    return (
    <div style={{ width: "100%"}}>
        { user && <SideDrawer/> }
            <Box>
                {/* {user && <MyChats/> */} 
                {/* {user && <ChatBox/> */}
            </Box>        
    </div>
    );
};

export default ChatPage
