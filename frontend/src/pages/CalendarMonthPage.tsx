import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Grid as MuiGrid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { GridProps } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
  }
>;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dummyEvents = [
  { day: "2025-05-16", title: "Morning Meeting" },
  { day: "2025-05-18", title: "Lunch with team" },
  { day: "2025-05-23", title: "Project deadline" },
  { day: "2025-05-28", title: "Doctor appointment" },
];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function CalendarMonthPage() {
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();
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

  console.log("startDate", startDate);

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
          const event = dummyEvents.find((e) => e.day === dayStr);
          const isCurrentMonth = day.getMonth() === inputDate.getMonth();
          const isToday = day.toDateString() === currentDate.toDateString();


    return (
      <Box
        key={dayStr}
        sx={{
          width: "14.285%", // 100% / 7 columns
          border: "1px solid #f1f1f1",
          height: 100,
          p: 1,
          bgcolor: isToday ? "#e3f2fd" : "#fff",
          color: isCurrentMonth ? "#000" : "#bbb",
        }}
      >
        <Tooltip title={event ? event.title : ""} arrow>
          <Paper
            elevation={0}
            onClick={() => event && navigate(`/event/${dayStr}`)}
            sx={{
              width: "100%",
              height: "100%",
              p: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              cursor: event ? "pointer" : "default",
              bgcolor: isToday || event ? "#1976d2" : "transparent",
              color: isToday || event ? "#fff" : undefined,
              borderRadius: 0,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={isToday ? 700 : 500}
              sx={{ mb: event ? 0.5 : 0 }}
            >
              {day.getDate()}
            </Typography>
            {event && (
              <Typography
                variant="caption"
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {event.title}
              </Typography>
            )}
          </Paper>
        </Tooltip>
      </Box>
    );
  })}
      </Grid>
    </Box>
  );
}