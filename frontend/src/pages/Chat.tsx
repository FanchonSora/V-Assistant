import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Slide,
  useTheme,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef, useEffect } from "react";
import { post } from "../utils/api";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
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
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      type ChatResp = { reply: string };
      const data = await post<ChatResp>(
        "/chat",
        { text: userMsg.text },
        token || undefined
      );

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMsg: ChatMessage = {
          text: data.reply.replace(/\n/g, "<br>"),
          isUser: false,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          text: `⚠️ Server Error: ${err instanceof Error ? err.message : "Unknown error"
            }`,
          isUser: false,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 500);
    }
  }, [message, token, isLoggedIn]);

  const handleLoginClick = () => {
    setShowLoginDialog(false);
    navigate("/login");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
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

  const TypingIndicator = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        gap: 1,
        mb: 1,
      }}
    >
      <Avatar
        sx={{
          bgcolor: "primary.main",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
        }}
      >
        <SmartToyIcon />
      </Avatar>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.grey[100], 0.8),
          backdropFilter: "blur(10px)",
          borderRadius: "18px 18px 18px 4px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: "primary.main",
              borderRadius: "50%",
              animation: "typing 1.4s infinite ease-in-out",
              animationDelay: "0s",
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: "primary.main",
              borderRadius: "50%",
              animation: "typing 1.4s infinite ease-in-out",
              animationDelay: "0.2s",
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: "primary.main",
              borderRadius: "50%",
              animation: "typing 1.4s infinite ease-in-out",
              animationDelay: "0.4s",
            }}
          />
          <style>
            {`
              @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-10px); opacity: 1; }
              }
            `}
          </style>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(102, 126, 234, 0.8) 1px, transparent 0)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          height: "calc(100vh - 64px - 48px)",
          display: "flex",
          flexDirection: "column",
          py: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t("chat.title", "Chat with V-Assistant")}
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Chat messages container */}
          <Paper
            elevation={8}
            sx={{
              flex: 1,
              mx: { xs: 1, sm: 2 },
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: alpha("#ffffff", 0.9),
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              ref={chatContainerRef}
              sx={{
                flex: 1,
                minHeight: 0,
                maxHeight: "60vh",
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.7),
                  },
                },
              }}
            >
              {chatMessages.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" gutterBottom>
                    Start a conversation
                  </Typography>
                  <Typography variant="body2">
                    Type a message below to begin chatting with your AI
                    assistant
                  </Typography>
                </Box>
              )}

              {chatMessages.map((msg, index) => (
                <Slide
                  key={index}
                  direction={msg.isUser ? "left" : "right"}
                  in={true}
                  timeout={300 + index * 100}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: msg.isUser ? "flex-end" : "flex-start",
                      gap: 1,
                    }}
                  >
                    {!msg.isUser && (
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                          animation: "fadeIn 0.5s ease-in-out",
                        }}
                      >
                        <SmartToyIcon />
                      </Avatar>
                    )}
                    <Paper
                      elevation={msg.isUser ? 8 : 3}
                      sx={{
                        p: 2.5,
                        width: "fit-content",
                        maxWidth: "100%",
                        bgcolor: msg.isUser
                          ? "primary.main"
                          : alpha(theme.palette.grey[100], 0.8),
                        background: msg.isUser
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : alpha(theme.palette.grey[100], 0.8),
                        color: "black", // Force text color to black
                        borderRadius: msg.isUser
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: msg.isUser
                          ? "0 8px 32px rgba(102, 126, 234, 0.4)"
                          : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        transform: "translateY(0)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: msg.isUser
                            ? "0 12px 40px rgba(102, 126, 234, 0.5)"
                            : "0 8px 25px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "fit-content",
                          maxWidth: "100%",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                          style={{
                            whiteSpace: "pre-line",
                            lineHeight: 1.5,
                            color: "black",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          opacity: 0.7,
                          fontSize: "0.75rem",
                          color: "black",
                        }}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Paper>
                    {msg.isUser && (
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.grey[500], 0.8),
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    )}
                  </Box>
                </Slide>
              ))}

              {isTyping && <TypingIndicator />}
            </Box>

            {/* Input area */}
            <Box
              sx={{
                p: 3,
                bgcolor: alpha("#ffffff", 0.95),
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.grey[300], 0.3),
                backdropFilter: "blur(10px)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  maxWidth: "800px",
                  margin: "0 auto",
                  alignItems: "flex-end",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  variant="outlined"
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "24px",
                      bgcolor: alpha("#ffffff", 0.9),
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
                      },
                      "& .MuiInputBase-input": {
                        color: "black", // Force input text color to black
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={startListening}
                  sx={{
                    bgcolor: isListening
                      ? "error.main"
                      : alpha(theme.palette.primary.main, 0.1),
                    color: isListening ? "white" : "primary.main",
                    width: 48,
                    height: 48,
                    border: "1px solid",
                    borderColor: isListening
                      ? "error.main"
                      : alpha(theme.palette.primary.main, 0.3),
                    animation: isListening ? "pulse 1s infinite" : "none",
                    "&:hover": {
                      bgcolor: isListening
                        ? "error.dark"
                        : alpha(theme.palette.primary.main, 0.2),
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {isListening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  startIcon={<SendIcon />}
                  sx={{
                    borderRadius: "24px",
                    px: 3,
                    py: 1.5,
                    minWidth: "100px",
                    height: 48,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.5)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                      transform: "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Login Dialog */}
        <Dialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: alpha("#ffffff", 0.95),
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
            🔐 Login Required
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
              Please log in to start chatting with V-Assistant and unlock the
              full experience.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 3 }}>
            <Button
              onClick={() => setShowLoginDialog(false)}
              sx={{ borderRadius: "20px", px: 3 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoginClick}
              variant="contained"
              sx={{
                borderRadius: "20px",
                px: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>

        <style>
          {`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
              100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
      </Container>
    </Box>
  );
};

export default Chat;
