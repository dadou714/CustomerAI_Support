"use client"
import { Box } from "@mui/material";
import { useState } from "react";
export default function Home() {
  const [messages, setMessages] = useState([
    {role: 'assistant', content: 'Hello and welcome to Visit Rwanda! I’m your AI customer support assistant, How can I assist you today?P'}
  ])
  return (
    <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="flex-end"
    >

    </Box>
  );
}
