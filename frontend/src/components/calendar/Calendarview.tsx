"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isSameDay, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  id: string
  email: string
  fecha: string
  hora_ini: string
  hora_fin: string
  lugar: string
  soporte: boolean
  telefono: string
  organizador: string
  descripcion: string
  codigo?: string
}

interface CalendarViewProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onDateSelect: (date: Date) => void
}

export default function CalendarView({ events, onEventClick, onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  // Generar los días del calendario para la semana actual
  useEffect(() => {
    const days = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()) // Domingo como primer día

    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(startOfWeek), i))
    }

    setCalendarDays(days)
  }, [currentDate])

  // Navegar a la semana anterior
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  // Navegar a la semana siguiente
  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Filtrar eventos para un día específico
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.fecha)
      return isSameDay(eventDate, day)
    })
  }

  // Organizar eventos superpuestos
  const organizeOverlappingEvents = (dayEvents: Event[]) => {
    if (!dayEvents.length) return []

    // Ordenar eventos por hora de inicio
    const sortedEvents = [...dayEvents].sort(
      (a, b) => a.hora_ini.localeCompare(b.hora_ini) || a.hora_fin.localeCompare(b.hora_fin),
    )

    // Agrupar eventos que se superponen
    const groups: Event[][] = []

    sortedEvents.forEach((event) => {
      // Buscar un grupo donde este evento no se superponga con ninguno
      const compatibleGroupIndex = groups.findIndex((group) => {
        return group.every((groupEvent) => {
          // Verificar si no hay superposición
          return event.hora_fin <= groupEvent.hora_ini || event.hora_ini >= groupEvent.hora_fin
        })
      })

      if (compatibleGroupIndex >= 0) {
        // Añadir al grupo compatible existente
        groups[compatibleGroupIndex].push(event)
      } else {
        // Crear un nuevo grupo
        groups.push([event])
      }
    })

    // Devolver los eventos con información de posicionamiento
    return sortedEvents.map((event) => {
      // Encontrar en qué grupo está este evento
      const groupIndex = groups.findIndex((group) => group.some((e) => e.id === event.id))

      // Encontrar cuántos grupos hay en total (para calcular el ancho)
      const totalGroups = groups.length

      return {
        ...event,
        groupIndex,
        totalGroups,
      }
    })
  }

  // Renderizar horas del día (8am a 8pm)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8)

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl overflow-hidden">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h2 className="text-xl font-semibold text-white">{format(currentDate, "MMMM yyyy", { locale: es })}</h2>
        <div className="flex space-x-2">
          <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-white/10">
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-white/10">
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Vista del calendario */}
      <div className="flex">
        {/* Columna de horas */}
        <div className="w-16 border-r border-white/20">
          <div className="h-12"></div> {/* Espacio para cabecera de días */}
          {timeSlots.map((hour) => (
            <div key={hour} className="h-20 border-t border-white/20 text-white/70 text-xs p-1">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-full">
            {calendarDays.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-1 min-w-[120px] border-r border-white/20 last:border-r-0">
                {/* Cabecera del día */}
                <div
                  className={`h-12 flex flex-col items-center justify-center border-b border-white/20 cursor-pointer hover:bg-white/10 ${
                    isSameDay(day, new Date()) ? "bg-blue-500/20" : ""
                  }`}
                  onClick={() => onDateSelect(day)}
                >
                  <div className="text-xs text-white/70">{format(day, "EEE", { locale: es })}</div>
                  <div className={`text-sm font-medium ${isSameDay(day, new Date()) ? "text-white" : "text-white/90"}`}>
                    {format(day, "d")}
                  </div>
                </div>

                {/* Eventos del día */}
                <div className="relative">
                  {timeSlots.map((hour) => (
                    <div key={hour} className="h-20 border-t border-white/20"></div>
                  ))}

                  {/* Renderizar eventos con manejo de superposición */}
                  {organizeOverlappingEvents(getEventsForDay(day)).map((event: any) => {
                    // Calcular posición y tamaño del evento
                    const [startHour, startMinute] = event.hora_ini.split(":").map(Number)
                    const [endHour, endMinute] = event.hora_fin.split(":").map(Number)

                    const startPosition = (startHour - 8) * 80 + (startMinute / 60) * 80
                    const duration = (endHour - startHour) * 80 + ((endMinute - startMinute) / 60) * 80

                    // Calcular ancho y posición horizontal para eventos superpuestos
                    const width = event.totalGroups > 1 ? `${100 / event.totalGroups}%` : "100%"
                    const left = event.totalGroups > 1 ? `${(event.groupIndex * 100) / event.totalGroups}%` : "0"

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="absolute rounded-md p-2 overflow-hidden cursor-pointer transition-all hover:brightness-110"
                        style={{
                          top: `${startPosition}px`,
                          height: `${Math.max(duration, 20)}px`,
                          width,
                          left,
                          backgroundColor: "rgba(59, 130, 246, 0.7)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <div className="text-xs font-medium text-white truncate">{event.organizador}</div>
                        <div className="text-xs text-white/80 truncate">{event.lugar}</div>
                        <div className="text-xs text-white/80">
                          {event.hora_ini} - {event.hora_fin}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
