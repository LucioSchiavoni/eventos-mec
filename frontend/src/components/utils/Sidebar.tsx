import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, subMonths, addMonths, isToday, isSameDay, isSameMonth } from "date-fns";


export default function Sidebar({
  miniCalendarTitle,
  monthDays,
  selectedDate,
  setSelectedDate,
  openEventForm,
}: {
  miniCalendarTitle: string;
  monthDays: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  openEventForm: () => void;
}) {

    
  return (
    <div className="w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl flex flex-col justify-between">
      <div>
        <button
          className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full"
          onClick={openEventForm}>
          <Plus className="h-5 w-5" />
          <span>Crear Evento</span>
        </button>


        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium capitalize">{miniCalendarTitle}</h3>

<div className="flex gap-1">
  <button
    className="p-1 rounded-full hover:bg-white/20"
    onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
  >
    <ChevronLeft className="h-4 w-4 text-white" />
  </button>
  <button
    className="p-1 rounded-full hover:bg-white/20"
    onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
  >
    <ChevronRight className="h-4 w-4 text-white" />
  </button>
</div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "L", "M", "X", "J", "V", "S"].map((day, i) => (
              <div key={i} className="text-xs text-white/70 font-medium py-1">
                {day}
              </div>
            ))}

            {monthDays.map((day, i) => (
              <div
                key={i}
                className={`text-xs rounded-full w-7 h-7 flex items-center justify-center cursor-pointer
                  ${isToday(day) ? "bg-blue-500 text-white" : ""}
                  ${isSameDay(day, selectedDate) && !isToday(day) ? "bg-white/20 text-white" : ""}
                  ${!isSameMonth(day, selectedDate) ? "text-white/40" : "text-white"}
                  hover:bg-white/20
                `}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}