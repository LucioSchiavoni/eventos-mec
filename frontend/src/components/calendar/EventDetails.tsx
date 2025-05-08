"use client"

import { X } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

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

interface EventDetailsProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

export default function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  if (!isOpen) return null

  const eventDate = parseISO(event.fecha)

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl max-w-md w-full mx-auto text-white overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold">Detalles del Evento</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium">{event.organizador}</h3>
            <p className="text-white/70">{format(eventDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
            <p className="text-white/70">
              {event.hora_ini} - {event.hora_fin}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium w-24">Lugar:</span>
              <span>{event.lugar}</span>
            </div>

            <div className="flex">
              <span className="font-medium w-24">Email:</span>
              <span>{event.email}</span>
            </div>

            {event.telefono && (
              <div className="flex">
                <span className="font-medium w-24">Teléfono:</span>
                <span>{event.telefono}</span>
              </div>
            )}

            <div className="flex">
              <span className="font-medium w-24">Soporte:</span>
              <span>{event.soporte ? "Requerido" : "No requerido"}</span>
            </div>
          </div>

          {event.descripcion && (
            <div className="space-y-2">
              <h4 className="font-medium">Descripción:</h4>
              <p className="text-white/90">{event.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
