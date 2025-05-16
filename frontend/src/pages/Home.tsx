import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
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

/**
 * Home Component
 * Main landing page that includes both feature showcase and chat interface
 * Features:
 * - Responsive design for mobile and desktop
 * - Speech-to-text functionality
 * - Chat interface with mock responses
 * - Feature showcase grid
 */
const Home = () => {
  // Theme and responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  // State management for chat functionality
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const token = localStorage.getItem("token"); // đã login trước đó
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add useEffect to handle auto-scrolling
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  /**
   * Handle sending messages and mock bot response
   * - Adds user message to chat
   * - Generates mock bot response
   * - Switches to chat mode if not already active
   */
  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    /* ---- push user message ngay lập tức ---- */
    const userMsg: ChatMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setMessage("");
    if (!isChatMode) setIsChatMode(true);

    /* ---- gọi backend /chat ---- */
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
        text: `⚠️ Lỗi máy chủ: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }
  }, [message, token, isChatMode]);

  /**
   * Handle Enter key press for sending messages
   * @param event - Keyboard event from input field
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  /**
   * Initialize and handle speech recognition
   * - Sets up Web Speech API
   * - Handles speech recognition events
   * - Updates UI based on recognition state
   */
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

  // Feature list for the landing page
  const features = [
    {
      title: t("features.smartAssistant.title"),
      description: t("features.smartAssistant.description"),
    },
    {
      title: t("features.easyIntegration.title"),
      description: t("features.easyIntegration.description"),
    },
    {
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
    {
      title: t("features.customization.title"),
      description: t("features.customization.description"),
    },
  ];

  /**
   * Render chat messages with user and bot avatars
   * - Displays messages in a scrollable container
   * - Shows different styles for user and bot messages
   * - Includes avatars for visual distinction
   */
  const renderChatMessages = () => {
    return (
      <Box
        ref={chatContainerRef}
        sx={{
          height: "60vh",
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
                color: msg.isUser ? "white" : "text.primary",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
            {msg.isUser && (
              <Avatar sx={{ bgcolor: "grey.500" }}>
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  // Main component render
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          align="center"
        >
          {t("welcome.title")}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          {t("welcome.subtitle")}
        </Typography>

        {/* Conditional rendering of features or chat interface */}
        {!isChatMode ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {features.map((feature, index) => (
              <Grid
                key={index}
                sx={{
                  display: "flex",
                  width: { xs: "100%", sm: "50%", md: "33.33%" },
                  p: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          renderChatMessages()
        )}

        {/* Input area for messages */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          {!isChatMode && (
            <Typography variant="body1" paragraph>
              {t("welcome.getStarted")}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              maxWidth: "600px",
              margin: "0 auto",
              mt: 4,
              px: 2,
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
      </Box>
    </Container>
  );
};

export default Home;
