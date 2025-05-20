import React, { useMemo, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid as MuiGrid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { GridProps } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
  }
>;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function CalendarMonthPage() {
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(dummyEvents);

  const inputDate = useMemo(() => (date ? new Date(date) : new Date()), [date]);

  const firstDayOfMonth = useMemo(() => {
    const d = new Date(inputDate);
    d.setDate(1);
    return d;
  }, [inputDate]);

  const startDate = useMemo(() => {
    const day = firstDayOfMonth.getDay();
    const start = new Date(firstDayOfMonth);
    start.setDate(start.getDate() - day);
    return start;
  }, [firstDayOfMonth]);

  const calendarDays = useMemo(() => {
    const daysArr: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      daysArr.push(d);
    }
    return daysArr;
  }, [startDate]);

  const currentDate = new Date("2025-05-16T22:35:00+07:00");

  const handleDateClick = useCallback(
    (day: Date) => {
      const formattedDate = formatDate(day);
      navigate(`/calendar/week/${formattedDate}`);
    },
    [navigate]
  );

  const handleEventClick = useCallback((event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent date click when clicking event
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Month {inputDate.getMonth() + 1} - {inputDate.getFullYear()}
      </Typography>

      <CalendarViewSelector />

      <Grid
        container
        columns={7}
        spacing={0}
        sx={{
          mb: 1,
          width: "100%",
        }}
      >
        {days.map((day, i) => (
          <Grid
            item
            xs={1}
            key={i}
            sx={{
              textAlign: "center",
              py: 1,
              fontWeight: "bold",
              color: "#333",
              border: "1px solid #f1f1f1",
              flexBasis: "14.285%",
              maxWidth: "14.285%",
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            {day}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={0} sx={{ flexWrap: "wrap" }}>
        {calendarDays.map((day) => {
          const dayStr = formatDate(day);
          const dayEvents = events.filter((e) => e.date === dayStr);
          const isCurrentMonth = day.getMonth() === inputDate.getMonth();
          const isToday = day.toDateString() === currentDate.toDateString();

          return (
            <Box
              key={dayStr}
              sx={{
                width: "14.285%",
                border: "1px solid #f1f1f1",
                height: 120,
                p: 1,
                bgcolor: isToday ? "#e3f2fd" : "#fff",
                color: isCurrentMonth ? "#000" : "#bbb",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isToday ? "#bbdefb" : "#f5f5f5",
                },
              }}
              onClick={() => handleDateClick(day)}
            >
              <Typography
                variant="body2"
                fontWeight={isToday ? 700 : 500}
                sx={{ mb: 1 }}
              >
                {day.getDate()}
              </Typography>
              {dayEvents.length > 0 && (
                <List dense disablePadding>
                  {dayEvents.map((event) => (
                    <ListItem
                      key={event.id}
                      disablePadding
                      sx={{ minHeight: 24 }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <FiberManualRecordIcon
                        sx={{
                          fontSize: 8,
                          mr: 0.5,
                          color: "#1976d2",
                        }}
                      />
                      <ListItemText
                        primary={event.title}
                        primaryTypographyProps={{
                          variant: "caption",
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: isToday ? "#fff" : "inherit",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          );
        })}
      </Grid>

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
