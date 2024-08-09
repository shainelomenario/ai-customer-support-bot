'use client'
import { Box, Stack, Button } from "@mui/material";
import { useState } from "react";
import TextField from '@mui/material/TextField';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hello! I'm your friendly customer support assistant for PC Part Picker. How can I help you today?`
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const userMessage = message; // Store the current message
    setMessage(''); // Clear the input field
    setMessages((messages) => [
      ...messages, 
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value || new Int8Array(), { stream: true });
      result += text;

      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      bgcolor="white" // Explicitly setting background color to white
    >
      <Stack 
        direction="column" 
        width="600px" 
        height="700px" 
        border="1px solid black" 
        p={2} 
        spacing={3}
      >
        <Stack 
          direction="column" 
          spacing={2} 
          flexGrow={1} 
          overflow="auto" 
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                } 
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
