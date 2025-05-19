import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";

const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8am - 19pm
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dummyEvents = [
  { day: "Mon", time: "09:00", duration: 1, title: "Morning Meeting" },
  { day: "Tue", time: "14:00", duration: 1, title: "Hangouts" },
  { day: "Wed", time: "10:00", duration: 2, title: "Insurance & Risk" },
  { day: "Thu", time: "09:00", duration: 1.5, title: "Boxing" },
  { day: "Fri", time: "13:00", duration: 2, title: "Marketing" },
  { day: "Sat", time: "10:00", duration: 1, title: "Logo Sketch" },
  { day: "Sun", time: "09:00", duration: 1, title: "Morning Ritual" },
];

// Hàm lấy tên ngày dạng 3 ký tự (Sun, Mon...)
function getDayAbbreviation(date: Date): string {
  return days[date.getDay()];
}

export default function CalendarDayPage() {
  const { date } = useParams<{ date: string }>();

  const inputDate = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [date]);

  const dayAbbr = useMemo(() => getDayAbbreviation(inputDate), [inputDate]);

  // Lọc event của ngày đó
  const eventsInDay = useMemo(
    () => dummyEvents.filter((e) => e.day === dayAbbr),
    [dayAbbr]
  );

  // Hiển thị ngày dd/mm/yyyy
  const displayDate = useMemo(() => {
    const d = inputDate.getDate();
    const m = inputDate.getMonth() + 1;
    const y = inputDate.getFullYear();
    return `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y}`;
  }, [inputDate]);

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
          {eventsInDay.map((event, i) => {
            const [hourStr, minuteStr] = event.time.split(":");
            const eventStartHour = parseInt(hourStr, 10);
            const eventStartMinute = parseInt(minuteStr, 10);
            const top =
              (eventStartHour - hours[0]) * 60 + (eventStartMinute / 60) * 60;
            const height = event.duration * 60;

            // Nếu sự kiện ngoài khung giờ thì bỏ qua hiển thị
            if (eventStartHour < hours[0] || eventStartHour >= hours[hours.length - 1] + 1)
              return null;

            return (
              <Paper
                key={i}
                elevation={3}
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
                <Typography fontSize={12}>
                  {event.time} - {event.duration} giờ
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
