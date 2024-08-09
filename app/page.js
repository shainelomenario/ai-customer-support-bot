'use client';
import { Box, Stack, Button, Avatar, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hello! I'm your friendly customer support assistant for PC Part Picker. How can I help you today?`
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const userMessage = message;
    setMessage('');
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
      bgcolor="#e0e0e0" // Light grey background color
      p={2}
    >
      <Box
        width="100%"
        maxWidth="400px"
        bgcolor="#ffffff" // White background color
        border="1px solid #ccc" // Light grey border
        borderRadius="4px" // Slightly rounded corners
        overflow="hidden"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          bgcolor="#f5f5f5" // Slightly darker grey for the header
          borderBottom="1px solid #ccc" // Border between header and body
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: '#f5f5f5', color: '#000' }}> S </Avatar>
            <Box ml={2}>
              <Typography variant="subtitle1" fontWeight="bold"> PC Part Picker Support</Typography>
              <Typography variant="body2" color="textSecondary"> shainelomenario@gmail.com </Typography>
            </Box>
          </Box>
        </Box>
        <Stack 
          direction="column" 
          spacing={2} 
          p={2}
          flexGrow={1} 
          overflow="auto" 
          maxHeight="400px"
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: '#e0e0e0', // Match scrollbar background to page
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc', // Match scrollbar thumb to border
              borderRadius: '4px', // Slightly rounded scrollbar thumb
            },
          }}
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
                bgcolor={message.role === 'assistant' ? '#f5f5f5' : '#d3d3d3'} // Light grey for assistant, slightly darker for user
                color="black"
                borderRadius="4px" // Slightly rounded message bubbles
                p={2}
                maxWidth="80%"
                sx={{
                  wordWrap: 'break-word',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Box p={1} borderTop="1px solid #ccc" bgcolor="#f5f5f5">
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              placeholder="Type your message..."
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px', // Slightly rounded input field
                  backgroundColor: '#ffffff', // White background for input
                },
                '& input': {
                  padding: '10px',
                },
              }}
            />
            <IconButton 
              onClick={sendMessage}
              sx={{
                backgroundColor: '#d3d3d3', // Match button to darker grey
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#c0c0c0', // Slightly darker on hover
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
