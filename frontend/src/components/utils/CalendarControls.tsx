import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarControls({
  goToToday,
  goToPrevious,
  goToNext,
  currentView,
  setCurrentView,
  viewTitle,
}: {
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
  viewTitle: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={goToToday}>
          Hoy
        </button>
        <div className="flex">
          <button className="p-2 text-white hover:bg-white/10 rounded-l-md" onClick={goToPrevious}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="p-2 text-white hover:bg-white/10 rounded-r-md" onClick={goToNext}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-white capitalize">{viewTitle}</h2>
      </div>

      <div className="flex items-center gap-2 rounded-md p-1">
        <button
          onClick={() => setCurrentView("day")}
          className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white/20" : ""} text-white text-sm`}
        >
          Día
        </button>
        <button
          onClick={() => setCurrentView("week")}
          className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white/20" : ""} text-white text-sm`}
        >
          Semana
        </button>
        <button
          onClick={() => setCurrentView("month")}
          className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white/20" : ""} text-white text-sm`}
        >
          Mes
        </button>
      </div>
    </div>
  );
}