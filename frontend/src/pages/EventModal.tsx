import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface EventModalProps {
  open: boolean;
  title: string;
  date: string;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  anchorEl?: HTMLElement | null;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  title,
  date,
  onClose,
  onDelete,
  onEdit,
  anchorEl,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Positioning logic: place modal to the left of anchorEl
  const [position, setPosition] = React.useState<{ top: number; left: number }>({ top: 100, left: 100 });

  useEffect(() => {
    if (anchorEl && open) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.top - 35 + window.scrollY,
        left: rect.left - 600 + window.scrollX,
      });
    }
  }, [anchorEl, open]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  return (
    <Box
      ref={modalRef}
      component={Paper}
      elevation={6}
      sx={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: 350,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        zIndex: 1500,
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
        {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {date}
        </Typography>
    </Box>
  );
};

export default EventModal;