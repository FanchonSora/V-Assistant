import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import formatDateLocal from "../utils/formatDataLocal";

interface Event {
  id: string;
  title: string;
  task_date: string; // YYYY-MM-DD
  task_time: string; // HH:mm
  day: string;       // bạn có thể bỏ hoặc giữ nếu cần
}

interface EventModalProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onDelete: (eventId: string) => void;
  onEdit: (event: Event) => void;
  onSave: (event: Event) => Promise<void>;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  event,
  onClose,
  onDelete,
  onEdit,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  React.useEffect(() => {
    if (event) {
      setEditedEvent(event);
    }
  }, [event]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedEvent) {
      try {
        await onSave(editedEvent);
        onEdit(editedEvent);
        setIsEditing(false);
        setShowCalendar(false);
      } catch (error) {
        alert("Failed to save changes. Please try again.");
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
    setShowCalendar(false);
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header with gradient background */}
        <Box
          sx={{
            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            color: "white",
            p: 3,
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {isEditing ? (
            <TextField
              fullWidth
              value={editedEvent?.title || ""}
              onChange={(e) =>
                setEditedEvent((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              variant="standard"
              sx={{
                "& .MuiInputBase-root": {
                  padding: "12px 8px",
                  display: "block",
                  width: "100%",
                  minHeight: "48px",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  padding: 0,
                  lineHeight: 1.4,
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "text",
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "white",
                },
              }}
            />
          ) : (
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {event.title}
            </Typography>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            {isEditing ? (
              <>
                {/* Time input */}
                <TextField
                  label="Time"
                  type="time"
                  value={editedEvent?.task_time || ""}
                  onChange={(e) =>
                    setEditedEvent((prev) =>
                      prev ? { ...prev, task_time: e.target.value } : null
                    )
                  }
                  fullWidth
                />

                {/* Date input with calendar popup */}
                <TextField
                  label="Date"
                  value={editedEvent?.task_date || ""}
                  onClick={() => setShowCalendar((show) => !show)}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                {showCalendar && (
                  <Box sx={{ mt: 1 }}>
                    <Calendar
                      onChange={(value) => {
                        if (value instanceof Date) {
                          const formattedDate = formatDateLocal(value);
                          setEditedEvent((prev) =>
                            prev ? { ...prev, task_date: formattedDate } : null
                          );
                          setShowCalendar(false);
                        }
                      }}
                      value={
                        editedEvent?.task_date
                          ? new Date(editedEvent.task_date)
                          : new Date()
                      }
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventIcon color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {event.task_date} at {event.task_time}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Actions */}
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => handleEdit()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Edit
              </Button>
            </>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
