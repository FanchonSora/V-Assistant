import { useParams } from "react-router-dom";
import CalendarDayPage from "./CalendarWeekPage";

export default function CalendarDayPageWrapper() {
  const { date } = useParams();
  return <CalendarDayPage key={date} />;
}