import { Box, Typography, Fab, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dummyEvents = [
  { date: "2025-06-16", time: "09:00", duration: 1, title: "Morning Meeting" },
  { date: "2025-06-17", time: "14:00", duration: 1, title: "Hangouts" },
  { date: "2025-06-18", time: "10:00", duration: 2, title: "Insurance & Risk" },
  { date: "2025-06-19", time: "09:00", duration: 1.5, title: "Boxing" },
  { date: "2025-06-20", time: "13:00", duration: 2, title: "Marketing" },
  { date: "2025-06-21", time: "10:00", duration: 1, title: "Logo Sketch" },
  { date: "2025-06-22", time: "09:00", duration: 1, title: "Morning Ritual" },
];

export default function CalendarWeekView() {
  const { date } = useParams();
  const inputDate = useMemo(() => {
    const parsed = date ? new Date(date) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const getMonday = (d: Date) => {
    const copy = new Date(d);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(copy.setDate(diff));
  };

  const startDate = useMemo(() => getMonday(inputDate), [inputDate]);

  const eventsByDate = useMemo(() => {
    const map: { [date: string]: typeof dummyEvents } = {};
    dummyEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; date: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleModalOpen = useCallback((title: string, date: string, el: HTMLElement) => {
    setModalData({ title, date });
    setAnchorEl(el);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => setModalOpen(false), []);

  return (
    <Box sx={{ position: "relative", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Calendar
      </Typography>

      <CalendarViewSelector />

      {/* Calendar grid */}
      <Box display="grid" gridTemplateColumns="80px repeat(7, 1fr)" border="1px solid #ccc">
        {/* Header row */}
        <Box />
        {days.map((day, index) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + index);
          const dayNumber = currentDate.getDate();
          const monthNumber = currentDate.getMonth() + 1;

          return (
            <Box
              key={day}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                py: 1,
                borderLeft: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography variant="subtitle1">{day}</Typography>
              <Typography variant="caption">
                {dayNumber}/{monthNumber}
              </Typography>
            </Box>
          );
        })}

        {/* Time rows */}
        {hours.map((hour) => (
          <Box key={`row-${hour}`} display="contents">
            {/* Time label */}
            <Box sx={{ borderTop: "1px solid #ccc", p: 1, fontSize: 12 }}>{hour}:00</Box>
            {/* Day columns */}
            {days.map((_, index) => {
              const currentDate = new Date(startDate);
              currentDate.setDate(startDate.getDate() + index);
              const currentDateStr = currentDate.toISOString().split("T")[0]; // yyyy-mm-dd

              return (
                <Box
                  key={`${currentDateStr}-${hour}`}
                  sx={{
                    borderTop: "1px solid #eee",
                    borderLeft: "1px solid #ccc",
                    height: 60,
                    position: "relative",
                  }}
                >
                  {eventsByDate[currentDateStr]
                    ?.filter((e) => parseInt(e.time.split(":")[0]) === hour)
                    .map((e, i) => (
                      <Paper
                        key={i}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 4,
                          right: 4,
                          height: e.duration * 60,
                          bgcolor: "#1976d2",
                          color: "#fff",
                          p: 1,
                          fontSize: 12,
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        onClick={(event) =>
                          handleModalOpen(e.title, `${currentDateStr} ${e.time}`, event.currentTarget)
                        }
                      >
                        {e.title}
                      </Paper>
                    ))}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Add button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 10,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        title={modalData?.title || ""}
        date={modalData?.date || ""}
        onClose={handleModalClose}
        onDelete={() => {
          setModalOpen(false);
        }}
        onEdit={() => {
          setModalOpen(false);
        }}
        anchorEl={anchorEl}
      />
    </Box>
  );
}
