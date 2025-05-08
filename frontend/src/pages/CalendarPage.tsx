"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import EventForm from "../components/forms/EventoForm"
import CalendarView from "../components/calendar/Calendarview"
import EventDetails from "../components/calendar/EventDetails"
import { getEventos } from "../api/eventos"

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

export default function CalendarPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Obtener eventos
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEventos,
  })

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsFormOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const closeEventDetails = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Calendario de Eventos</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors text-white"
        >
          <Plus className="h-5 w-5" />
          Nuevo Evento
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 text-white">
          Error al cargar los eventos. Por favor, intente nuevamente.
        </div>
      ) : (
        <CalendarView events={events} onEventClick={handleEventClick} onDateSelect={handleDateSelect} />
      )}

      {isFormOpen && <EventForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialDate={selectedDate} />}

      {selectedEvent && <EventDetails event={selectedEvent} isOpen={!!selectedEvent} onClose={closeEventDetails} />}
    </div>
  )
}
