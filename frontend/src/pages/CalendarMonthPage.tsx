import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Grid as MuiGrid,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { GridProps } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

import { deleteTask } from "../services/taskService";
import { updateTask } from "../services/taskService";

import { getTasksByRange } from "../utils/api";

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
  task_date: string;
  task_time: string;
  day: string;
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function CalendarMonthPage() {
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const theme = useTheme();

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

  useEffect(() => {
    const startStr = formatDate(calendarDays[0]);
    const endStr = formatDate(calendarDays[calendarDays.length - 1]);

    const token = localStorage.getItem("token");

    getTasksByRange(token ?? undefined, startStr, endStr)
      .then((data) => {
        const cleanedData: Event[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          task_date: item.task_date,
          task_time: item.task_time,
          day: item.day,
        }));
        setEvents(cleanedData);
      })
      .catch(console.error);
  }, [calendarDays]);

  const currentDate = new Date();

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

  const handleEventSave = async (editedEvent: Event) => {
    try {
      const token = localStorage.getItem("token") ?? "";
      await updateTask(token, editedEvent.id, {
        title: editedEvent.title,
        task_date: editedEvent.task_date,
        task_time: editedEvent.task_time,
      });
    } catch (error: any) {
      console.error("Failed to update task:", error);
      alert(`Error updating task: ${error.message}`);
      throw error;
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token") ?? "";
      await deleteTask(token, eventId);
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
      setModalOpen(false);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      alert(`Error deleting task: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Monthly Calendar
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
              color: "text.primary",
              border: `1px solid ${theme.palette.divider}`,
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
          const dayEvents = events.filter((e) => e.task_date === dayStr);
          const isCurrentMonth = day.getMonth() === inputDate.getMonth();
          const isToday = day.toDateString() === currentDate.toDateString();

          return (
            <Box
              key={dayStr}
              sx={{
                width: "14.285%",
                border: `1px solid ${theme.palette.divider}`,
                height: 120,
                p: 1,
                bgcolor: isToday ? "primary.main" : "background.paper",
                color: isToday
                  ? "primary.contrastText"
                  : isCurrentMonth
                    ? "text.primary"
                    : "text.disabled",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isToday ? "primary.dark" : "action.hover",
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
                      <ListItemText
                        primary={event.title}
                        primaryTypographyProps={{
                          variant: "caption",
                          sx: {
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            backgroundColor: isToday
                              ? "background.paper"
                              : "primary.main",
                            color: isToday ? "primary.main" : "white",
                            fontWeight: 500,
                            display: "block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
        onSave={handleEventSave}
      />
    </Box>
  );
}
