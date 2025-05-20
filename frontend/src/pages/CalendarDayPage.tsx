import React, { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8am - 19pm
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  day: string;
}

const dummyEvents: Event[] = [
  {
    id: "1",
    day: "Mon",
    time: "09:00",
    title: "Morning Meeting",
    date: "2024-03-18",
  },
  {
    id: "2",
    day: "Tue",
    time: "14:00",
    title: "Hangouts",
    date: "2024-03-19",
  },
  {
    id: "3",
    day: "Wed",
    time: "10:00",
    title: "Insurance & Risk",
    date: "2024-03-20",
  },
  {
    id: "4",
    day: "Thu",
    time: "09:00",
    title: "Boxing",
    date: "2024-03-21",
  },
  {
    id: "5",
    day: "Fri",
    time: "13:00",
    title: "Marketing",
    date: "2024-03-22",
  },
  {
    id: "6",
    day: "Sat",
    time: "10:00",
    title: "Logo Sketch",
    date: "2024-03-23",
  },
  {
    id: "7",
    day: "Sun",
    time: "09:00",
    title: "Morning Ritual",
    date: "2024-03-24",
  },
];

// Hàm lấy tên ngày dạng 3 ký tự (Sun, Mon...)
function getDayAbbreviation(date: Date): string {
  return days[date.getDay()];
}

export default function CalendarDayPage() {
  const { date } = useParams<{ date: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(dummyEvents);

  const inputDate = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [date]);

  const dayAbbr = useMemo(() => getDayAbbreviation(inputDate), [inputDate]);

  // Lọc event của ngày đó
  const eventsInDay = useMemo(
    () => events.filter((e) => e.day === dayAbbr),
    [dayAbbr, events]
  );

  // Hiển thị ngày dd/mm/yyyy
  const displayDate = useMemo(() => {
    const d = inputDate.getDate();
    const m = inputDate.getMonth() + 1;
    const y = inputDate.getFullYear();
    return `${d.toString().padStart(2, "0")}/${m
      .toString()
      .padStart(2, "0")}/${y}`;
  }, [inputDate]);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);

  const handleEventEdit = useCallback((editedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === editedEvent.id ? editedEvent : e))
    );
  }, []);

  const handleEventDelete = useCallback((eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
  }, []);

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <CalendarViewSelector />

      <Typography variant="h4" gutterBottom>
        {displayDate} ({dayAbbr})
      </Typography>

      {/* Calendar grid */}
      <Box
        display="grid"
        gridTemplateColumns="80px 1fr"
        border="1px solid #ccc"
        maxWidth={"100%"}
        minHeight={hours.length * 60}
      >
        {/* Column giờ */}
        <Box>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                borderBottom: "1px solid #ccc",
                px: 1,
                fontSize: 12,
                color: "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                userSelect: "none",
              }}
            >
              {hour}:00
            </Box>
          ))}
        </Box>

        {/* Cột ngày */}
        <Box sx={{ position: "relative" }}>
          {/* Các ô giờ */}
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                borderBottom: "1px solid #eee",
                borderLeft: "1px solid #ccc",
              }}
            />
          ))}

          {/* Render event */}
          {eventsInDay.map((event) => {
            const [hourStr, minuteStr] = event.time.split(":");
            const eventStartHour = parseInt(hourStr, 10);
            const eventStartMinute = parseInt(minuteStr, 10);
            const top =
              (eventStartHour - hours[0]) * 60 + (eventStartMinute / 60) * 60;
            const height = 60; // Fixed height for events

            // Nếu sự kiện ngoài khung giờ thì bỏ qua hiển thị
            if (
              eventStartHour < hours[0] ||
              eventStartHour >= hours[hours.length - 1] + 1
            )
              return null;

            return (
              <Paper
                key={event.id}
                elevation={3}
                onClick={() => handleEventClick(event)}
                sx={{
                  position: "absolute",
                  top,
                  left: 4,
                  right: 4,
                  height,
                  bgcolor: "#1976d2",
                  color: "#fff",
                  p: 1,
                  fontSize: 14,
                  overflow: "hidden",
                  borderRadius: 1,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Typography fontWeight="bold" noWrap>
                  {event.title}
                </Typography>
                <Typography fontSize={12}>{event.time}</Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        event={selectedEvent}
        onClose={() => setModalOpen(false)}
        onDelete={handleEventDelete}
        onEdit={handleEventEdit}
      />
    </Box>
  );
}
