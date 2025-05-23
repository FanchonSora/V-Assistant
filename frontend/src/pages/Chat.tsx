import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef, useEffect } from "react";
import { post } from "../utils/api";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
}

// Extend Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Interface for chat messages
interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const token = localStorage.getItem("token");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add useEffect to handle auto-scrolling
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      type ChatResp = { reply: string };
      const data = await post<ChatResp>(
        "/chat",
        { text: userMsg.text },
        token || undefined
      );

      const botMsg: ChatMessage = {
        text: data.reply.replace(/\n/g, "<br>"),
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        text: `⚠️ Server Error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }
  }, [message, token]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "calc(100vh - 64px - 48px)", // Subtract AppBar height and Layout padding
        display: "flex",
        flexDirection: "column",
        py: 0, // Remove vertical padding since Layout already provides it
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 0.5 }}
        >
          {t("chat.title", "Chat with V-Assistant")}
        </Typography>

        {/* Chat messages container */}
        <Box
          ref={chatContainerRef}
          sx={{
            height: "calc(100vh - 64px - 48px - 80px)", // Subtract AppBar, Layout padding, and input area height
            overflowY: "auto",
            mb: 0.5,
            px: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {chatMessages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.isUser ? "flex-end" : "flex-start",
                gap: 1,
              }}
            >
              {!msg.isUser && (
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: msg.isUser ? "primary.main" : "grey.100",
                  color: msg.isUser ? "white" : "black",
                  borderRadius: 2,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                  style={{
                    color: msg.isUser ? "white" : "black",
                    whiteSpace: "pre-line",
                  }}
                />
              </Paper>
              {msg.isUser && (
                <Avatar sx={{ bgcolor: "grey.500" }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}
        </Box>

        {/* Input area */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            maxWidth: "600px",
            margin: "0 auto",
            mt: "auto",
            mb: 0.5,
            px: 1,
            position: "sticky",
            bottom: 0,
            py: 0.5,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your prompt..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
          <IconButton
            onClick={startListening}
            size="small"
            sx={{
              bgcolor: isListening ? "error.main" : "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: isListening ? "error.dark" : "primary.dark",
              },
              width: "40px",
              height: "40px",
            }}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            size="small"
            sx={{
              borderRadius: "20px",
              px: 2,
              minWidth: "80px",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
