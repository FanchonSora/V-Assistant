import { useNavigate, useParams } from "react-router-dom";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material"; // <-- type-only import
import { useState } from "react";

const viewOptions = ["day", "week", "month"];

const CalendarViewSelector = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("/day")) return "day";
    if (path.includes("/week")) return "week";
    if (path.includes("/month")) return "month";
    return "week";
  });

  const handleChange = (e: SelectChangeEvent) => {
    const newView = e.target.value;
    setView(newView);
    navigate(`/calendar/${newView}/${date}`);
  };

  return (
    <Box sx={{ minWidth: 120, mb: 2 }}>
      <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel id="view-select-label">View</InputLabel>
        <Select value={view} label="View" onChange={handleChange}>
          {viewOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CalendarViewSelector;
