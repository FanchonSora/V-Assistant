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
        text: data.reply,
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
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ my: 4, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("chat.title", "Chat with V-Assistant")}
        </Typography>

        {/* Chat messages container */}
        <Box
          ref={chatContainerRef}
          sx={{
            height: "calc(100vh - 280px)",
            overflowY: "auto",
            mb: 2,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
                <Typography
                  variant="body1"
                  sx={{ color: msg.isUser ? "white" : "black" }}
                >
                  {msg.text}
                </Typography>
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
            gap: 2,
            maxWidth: "600px",
            margin: "0 auto",
            mt: "auto",
            mb: 2,
            px: 2,
            position: "sticky",
            bottom: 0,
            py: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your prompt..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
            }}
          />
          <IconButton
            onClick={startListening}
            sx={{
              bgcolor: isListening ? "error.main" : "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: isListening ? "error.dark" : "primary.dark",
              },
              width: "48px",
              height: "48px",
            }}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{
              borderRadius: "24px",
              px: 4,
              minWidth: "100px",
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
