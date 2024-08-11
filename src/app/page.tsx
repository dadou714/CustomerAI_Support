"use client"
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { MessageT, ProcessTextFuncT } from "./types/common";
export default function Home() {
  const [messages, setMessages] = useState<MessageT[]>([
    {role: 'assistant', content: 'Hello and welcome to Visit Rwanda! I’m your AI customer support assistant, How can I assist you today?'}
  ])
  const [message, setMessage] = useState<string>('');

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role: 'user', content: message}, 
      {role:'assistant', content: ''}])
    const response = fetch("/api/chat",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async(res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''
      return reader?.read().then(function processText({done, value}): ProcessTextFuncT{
        if(done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages: MessageT[]) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages, 
            {...lastMessage, content: lastMessage.content + text}]
        })
        return reader.read().then(processText)
      })
    })
  }
  return (
    <>
    <div
    className="w-svw h-screen flex flex-col justify-center items-center "
    > 
      <div className="flex flex-col p-2 lg:p-0 lg:w-1/4 h-[700px] border border-spacing-x-4 border-spacing-y-12 bg-secondary rounded">
      <div className="w-full lg:w-[449px] text-white text-center mx-auto p-2 h-12 bg-primary"> Visit Rwanda Support</div>
        <Stack direction={'column'} spacing={4} p={2} flexGrow={1} overflow={'auto'} maxHeight="100%">
          {messages.map((message: MessageT, index: number)=>(
            <Box key={index} display='flex' justifyContent={message.role === 'assistant'?'flex-start':'flex-end'}>
              <Box bgcolor={message.role === 'assistant'?'white':'#0cad85'} color={message.role === 'assistant'?"black":"white"} borderRadius={2} p={2 } boxShadow={2}>
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} p={2}>
          <TextField label="Message" fullWidth value={message} 
          onChange={(e) => setMessage(e.target.value)}/>
          <Button variant="contained" onClick={sendMessage} style={{
            backgroundColor:"#0cad85"
          }}>Send</Button>
        </Stack>
      </div>
    </div>
    </>
    
  );
}
