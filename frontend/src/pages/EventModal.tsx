import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";

interface Event {
  id: string;
  title: string;
  task_date: string;
  task_time: string;
  day: string;
}

interface EventModalProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onDelete: (eventId: string) => void;
  onEdit: (event: Event) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  event,
  onClose,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);

  // Initialize editedEvent when event changes
  React.useEffect(() => {
    if (event) {
      setEditedEvent(event);
    }
  }, [event]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedEvent) {
      onEdit(editedEvent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
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
                "& .MuiInputBase-input": {
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
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
                <TextField
                  label="Time"
                  type="time"
                  value={editedEvent?.task_time || ""}
                  onChange={(e) =>
                    setEditedEvent((prev) =>
                      prev ? { ...prev, time: e.target.value } : null
                    )
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Day"
                  value={editedEvent?.day || ""}
                  onChange={(e) =>
                    setEditedEvent((prev) =>
                      prev ? { ...prev, day: e.target.value } : null
                    )
                  }
                  fullWidth
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    )
                  )}
                </TextField>
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
