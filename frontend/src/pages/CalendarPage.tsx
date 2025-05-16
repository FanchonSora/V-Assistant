import { Box, Typography, Fab, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8am - 8pm
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dummyEvents = [
  { day: "Mon", time: "09:00", duration: 1, title: "Morning Meeting" },
  { day: "Tue", time: "14:00", duration: 1, title: "Hangouts" },
  { day: "Wed", time: "10:00", duration: 2, title: "Insurance & Risk" },
  { day: "Thu", time: "09:00", duration: 1.5, title: "Boxing" },
  { day: "Fri", time: "13:00", duration: 2, title: "Marketing" },
  { day: "Sat", time: "10:00", duration: 1, title: "Logo Sketch" },
  { day: "Sun", time: "09:00", duration: 1, title: "Morning Ritual" },
];

export default function CalendarWeekView() {
  const { date } = useParams();
  console.log("Calendar ID:", date);

  const inputDate = useMemo(() => {
  const parsed = date ? new Date(date) : new Date();
  return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const getMonday = (d: Date) => {
    const copy = new Date(d);
    const day = copy.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
    return new Date(copy.setDate(diff));
  };

  const startDate = useMemo(() => getMonday(inputDate), [inputDate]);

  const eventsByDay = useMemo(() => {
    const map: { [key: string]: typeof dummyEvents } = {};
    days.forEach((d) => (map[d] = []));
    dummyEvents.forEach((e) => map[e.day].push(e));
    return map;
  }, []);

  return (
    <Box sx={{ position: "relative", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Calendar
      </Typography>

      {/* Calendar grid */}
      <Box display="grid" gridTemplateColumns="80px repeat(7, 1fr)" border="1px solid #ccc">
        {/* Header row */}
        <Box />
        {days.map((day, index) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + index);
          const dayNumber = date.getDate();
          const monthNumber = date.getMonth() + 1;

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
            {days.map((day) => (
              <Box
                key={`${day}-${hour}`}
                sx={{
                  borderTop: "1px solid #eee",
                  borderLeft: "1px solid #ccc",
                  height: 60,
                  position: "relative",
                }}
              >
                {eventsByDay[day]
                  .filter((e) => parseInt(e.time.split(":")[0]) === hour)
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
                      }}
                    >
                      {e.title}
                    </Paper>
                  ))}
              </Box>
            ))}
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
    </Box>
  );
}
