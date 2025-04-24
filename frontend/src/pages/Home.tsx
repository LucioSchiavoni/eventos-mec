import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Clock,
  MapPin,
  Users,
  CalendarIcon,
} from "lucide-react"
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  parseISO,
} from "date-fns"
import { es } from "date-fns/locale"
import EventForm from "../components/forms/EventoForm"
import { getEventos } from "../api/eventos"
import CalendarControls from "../components/utils/CalendarControls"
import Sidebar from "../components/utils/Sidebar"
import Header from "../components/utils/Headers"

// interface EventData {
//   id: number
//   email: string
//   fecha: string
//   hora: string
//   lugar: string
//   soporte: boolean
//   organizador: string
//   descripcion: string
//   codigo: string
//   created_at: string
// }

interface CalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  day: number
  description: string
  location: string
  attendees: string[]
  organizer: string
  email: string
  codigo: string
  date: Date
}

// Colores para los eventos
const eventColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-red-400",
  "bg-orange-400",
]

export default function Calendar() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [__, setShowAIPopup] = useState(false)
  // const [typedText, setTypedText] = useState("")
  // const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEventForm, setShowEventForm] = useState(false)

  // Estado para la navegación del calendario
  const [_, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("week")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Consulta para obtener los eventos del backend
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEventos,
  })

  const events = useMemo(() => {
    if (!eventsData) return [];
  
    return eventsData.map((event: any, index: number) => {
      try {
        let eventDate;
        try {
          eventDate = parseISO(event.fecha);
          if (isNaN(eventDate.getTime())) {
            console.error(`Fecha inválida para el evento ${event.id}:`, event.fecha);
            eventDate = new Date(); 
          }
        } catch (error) {
          console.error(`Error al parsear la fecha del evento ${event.id}:`, error);
          eventDate = new Date(); 
        }
  
        let startHours = 0,
          startMinutes = 0,
          endHours = 0,
          endMinutes = 0;
        try {
          if (event.hora_ini) {
            const [startHourPart, startMinutePart] = event.hora_ini.split(":").map(Number);
            startHours = startHourPart || 0;
            startMinutes = startMinutePart || 0;
          }
          if (event.hora_fin) {
            const [endHourPart, endMinutePart] = event.hora_fin.split(":").map(Number);
            endHours = endHourPart || 0;
            endMinutes = endMinutePart || 0;
          }
        } catch (error) {
          console.error(`Error al parsear las horas del evento ${event.id}:`, error);
        }
        const startDateTime = new Date(eventDate);
        startDateTime.setHours(startHours);
        startDateTime.setMinutes(startMinutes);
  
        const endDateTime = new Date(eventDate);
        endDateTime.setHours(endHours);
        endDateTime.setMinutes(endMinutes);
  
       
        let startTimeFormatted, endTimeFormatted;
        try {
          startTimeFormatted = format(startDateTime, "HH:mm");
          endTimeFormatted = format(endDateTime, "HH:mm");
        } catch (error) {
          console.error(`Error al formatear las horas del evento ${event.id}:`, error);
          startTimeFormatted = "00:00";
          endTimeFormatted = "01:00";
        }
  
        return {
          id: event.id,
          title: `Reunión: ${event.organizador || "Sin organizador"}`,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          color: eventColors[index % eventColors.length],
          day: getDay(eventDate),
          description: event.descripcion || "Sin descripción",
          location: event.lugar || "Sin ubicación",
          attendees: [event.email || "Sin email"],
          organizer: event.organizador || "Sin organizador",
          email: event.email || "Sin email",
          codigo: event.codigo || "Sin código",
          date: eventDate,
        };
      } catch (error) {
        console.error(`Error al procesar el evento ${event.id}:`, error);
        return {
          id: event.id || 0,
          title: "Evento con error",
          startTime: "00:00",
          endTime: "01:00",
          color: eventColors[index % eventColors.length],
          day: 0,
          description: "Error al procesar este evento",
          location: "Desconocido",
          attendees: [""],
          organizer: "Desconocido",
          email: "",
          codigo: "",
          date: new Date(),
        };
      }
    });
  }, [eventsData]);


  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events

    const query = searchQuery.toLowerCase()
    return events.filter(
      (event:any) =>
        event.email.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.codigo.toLowerCase().includes(query) ||
        event.title.toLowerCase().includes(query),
    )
  }, [events, searchQuery])

  // Calcular los eventos visibles según la vista actual y la fecha seleccionada
  const visibleEvents = useMemo(() => {
    if (currentView === "day") {
      return filteredEvents.filter((event: any) => isSameDay(event.date, selectedDate))
    } else if (currentView === "week") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 })

      return filteredEvents.filter((event:any) => event.date >= start && event.date <= end)
    } else {
      // month view
      const start = startOfMonth(selectedDate)
      const end = endOfMonth(selectedDate)

      return filteredEvents.filter((event:any) => event.date >= start && event.date <= end)
    }
  }, [filteredEvents, currentView, selectedDate])

  // Calcular los días de la semana actual
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [selectedDate])

  // Calcular los días del mes para el mini calendario
  const monthDays = useMemo(() => {
    const firstDay = startOfMonth(selectedDate)
    const lastDay = endOfMonth(selectedDate)
    const days = eachDayOfInterval({ start: firstDay, end: lastDay })

    // Añadir días del mes anterior para completar la primera semana
    const firstDayOfWeek = getDay(firstDay)
    const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => subDays(firstDay, firstDayOfWeek - i))

    // Añadir días del mes siguiente para completar la última semana
    const lastDayOfWeek = getDay(lastDay)
    const nextMonthDays = Array.from({ length: 6 - lastDayOfWeek }, (_, i) => addDays(lastDay, i + 1))

    return [...prevMonthDays, ...days, ...nextMonthDays]
  }, [selectedDate])

  // Franjas horarias para la vista de día y semana
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM a 8 PM

  useEffect(() => {
    setIsLoaded(true)

    // Show AI popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [])


  // Funciones de navegación
  const goToToday = () => {
    setSelectedDate(new Date())
    setCurrentDate(new Date())
  }

  const goToPrevious = () => {
    if (currentView === "day") {
      setSelectedDate((prev) => subDays(prev, 1))
    } else if (currentView === "week") {
      setSelectedDate((prev) => subWeeks(prev, 1))
    } else {
      setSelectedDate((prev) => subMonths(prev, 1))
    }
  }

  const goToNext = () => {
    if (currentView === "day") {
      setSelectedDate((prev) => addDays(prev, 1))
    } else if (currentView === "week") {
      setSelectedDate((prev) => addWeeks(prev, 1))
    } else {
      setSelectedDate((prev) => addMonths(prev, 1))
    }
  }

  const selectDay = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime: string, endTime: string) => {
    try {
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      const [endHours, endMinutes] = endTime.split(":").map(Number)

      // Verificar que los valores sean números válidos
      const start = (isNaN(startHours) ? 8 : startHours) + (isNaN(startMinutes) ? 0 : startMinutes) / 60
      const end = (isNaN(endHours) ? 9 : endHours) + (isNaN(endMinutes) ? 0 : endMinutes) / 60

      // Asegurarse de que start sea menor que end y esté dentro del rango visible
      const safeStart = Math.max(8, Math.min(start, 20)) // Entre 8 AM y 8 PM
      const safeEnd = Math.max(safeStart + 0.5, Math.min(end, 21)) // Al menos 30 min después de start

      const top = (safeStart - 8) * 80 // 80px por hora
      const height = (safeEnd - safeStart) * 80

      return { top: `${top}px`, height: `${height}px` }
    } catch (error) {
      console.error("Error al calcular estilo del evento:", error)
      return { top: "0px", height: "80px" } // Valores predeterminados
    }
  }



  const viewTitle = useMemo(() => {
    if (currentView === "day") {
      return format(selectedDate, "d 'de' MMMM yyyy", { locale: es })
    } else if (currentView === "week") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 })
      return `${format(start, "d", { locale: es })} - ${format(end, "d 'de' MMMM yyyy", { locale: es })}`
    } else {
      return format(selectedDate, "MMMM yyyy", { locale: es })
    }
  }, [selectedDate, currentView])


  const miniCalendarTitle = useMemo(() => {
    return format(selectedDate, "MMMM yyyy", { locale: es })
  }, [selectedDate])

  const openEventForm = () => {
    setShowEventForm(true)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        className="absolute inset-0 object-cover w-full h-full"
      />
    <h1 className="absolute left-5 top-5 text-4xl font-bold text-white">MEC Eventos</h1>
    <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="relative h-screen w-full pt-20 flex">
      <Sidebar
          miniCalendarTitle={miniCalendarTitle}
          monthDays={monthDays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          openEventForm={openEventForm}
        />


        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >

          <div className=" flex flex-col">
          <CalendarControls
            goToToday={goToToday}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            currentView={currentView}
            setCurrentView={setCurrentView}
            viewTitle={viewTitle}
          />
 
        </div>

   
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">

              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}

              {!isLoading && currentView === "day" && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-white/20 text-center">
                    <h3 className="text-xl font-semibold text-white capitalize">
                      {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="relative">
                      {timeSlots.map((time, i) => (
                        <div key={i} className="flex h-20 border-b border-white/10">
                          <div className="w-20 pr-4 text-right text-xs text-white/70 py-2">
                            {time > 12 ? `${time - 12} PM` : `${time} AM`}
                          </div>
                          <div className="flex-1 border-l border-white/20"></div>
                        </div>
                      ))}

                      {visibleEvents.map((event:any, i: number) => {
                        const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                        return (
                          <div
                            key={i}
                            className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg left-20 right-4`}
                            style={eventStyle}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                            <div className="opacity-80 text-[10px]">{event.location}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Week View */}
              {!isLoading && currentView === "week" && (
                <>
                  {/* Week Header */}
                  <div className="grid grid-cols-8 border-b border-white/20">
                    <div className="p-2 text-center text-white/50 text-xs"></div>
                    {weekDays.map((day, i) => (
                      <div key={i} className="p-2 text-center border-l border-white/20">
                        <div className="text-xs text-white/70 font-medium">
                          {format(day, "EEE", { locale: es }).toUpperCase()}
                        </div>
                        <div
                          className={`text-lg font-medium mt-1 text-white 
                            ${isToday(day) ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}
                          `}
                        >
                          {format(day, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time Grid */}
                  <div className="grid grid-cols-8">
                    {/* Time Labels */}
                    <div className="text-white/70">
                      {timeSlots.map((time, i) => (
                        <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs">
                          {time > 12 ? `${time - 12} PM` : `${time} AM`}
                        </div>
                      ))}
                    </div>

                    {/* Days Columns */}
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="border-l border-white/20 relative">
                        {timeSlots.map((_, timeIndex) => (
                          <div key={timeIndex} className="h-20 border-b border-white/10"></div>
                        ))}

                        {/* Events */}
                        {visibleEvents
                          .filter((event: any) => isSameDay(event.date, day))
                          .map((event: any, i:number) => {
                            const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                            return (
                              <div
                                key={i}
                                className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                                style={{
                                  ...eventStyle,
                                  left: "4px",
                                  right: "4px",
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Month View */}
              {!isLoading && currentView === "month" && (
                <div className="h-full flex flex-col">
                  <div className="grid grid-cols-7 border-b border-white/20">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, i) => (
                      <div key={i} className="p-2 text-center text-white font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 p-1">
                    {monthDays.map((day, i) => (
                      <div
                        key={i}
                        className={`min-h-[100px] p-1 border border-white/10 rounded-md
                          ${isToday(day) ? "bg-blue-500/20" : ""}
                          ${isSameDay(day, selectedDate) ? "ring-2 ring-white" : ""}
                          ${!isSameMonth(day, selectedDate) ? "opacity-40" : ""}
                        `}
                        onClick={() => selectDay(day)}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center text-white`}
                          >
                            {format(day, "d")}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          {visibleEvents
                            .filter((event: any) => isSameDay(event.date, day))
                            .slice(0, 3)
                            .map((event: any, eventIndex: number) => (
                              <div
                                key={eventIndex}
                                className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEventClick(event)
                                }}
                              >
                                {event.startTime} {event.title}
                              </div>
                            ))}
                       {visibleEvents
                        .filter((event: { date: Date }) => isSameDay(event.date, day)).length > 3 && (
                        <div className="text-xs text-white/70 pl-1">
                        +{visibleEvents.filter((event: { date: Date }) => isSameDay(event.date, day)).length - 3} más
                         </div>
                    )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className={`${selectedEvent.color} bg-opacity-90 backdrop-filter backdrop-blur-md p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}
            >
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(selectedEvent.date, "EEEE d 'de' MMMM yyyy", { locale: es })}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Asistentes:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "Sin asistentes"}
                  </span>
                </p>
                <p>
                  <strong>Organizador:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEvent.email}
                </p>
                <p>
                  <strong>Código:</strong> {selectedEvent.codigo}
                </p>
                <p>
                  <strong>Descripción:</strong> {selectedEvent.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <EventForm isOpen={showEventForm} onClose={() => setShowEventForm(false)} initialDate={selectedDate} />
      </main>
    </div>
  )
}
