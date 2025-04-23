import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { X, CalendarIcon, Clock } from 'lucide-react'

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
}

interface EventFormData {
  email: string
  fecha: string
  hora: string
  lugar: string
  soporte: boolean
  organizador: string
  descripcion: string
  codigo: string
}

export default function EventForm({ isOpen, onClose, initialDate = new Date() }: EventFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<EventFormData>({
    email: "",
    fecha: format(initialDate, "yyyy-MM-dd"),
    hora: format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
    lugar: "",
    soporte: false,
    organizador: "",
    descripcion: "",
    codigo: "",
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createEventMutation = useMutation({
    mutationFn: async (eventData: EventFormData) => {

      // const response = await fetch('url/eventos', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(eventData),
      // });
      // return response.json();
      await new Promise(resolve => setTimeout(resolve, 500))
      return { ...eventData, id: Date.now(), created_at: new Date().toISOString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      onClose()
      setFormData({
        email: "",
        fecha: format(new Date(), "yyyy-MM-dd"),
        hora: format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
        lugar: "",
        soporte: false,
        organizador: "",
        descripcion: "",
        codigo: "",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = "El email es obligatorio"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria"
    if (!formData.hora) newErrors.hora = "La hora es obligatoria"
    if (!formData.lugar) newErrors.lugar = "El lugar es obligatorio"
    if (!formData.organizador) newErrors.organizador = "El organizador es obligatorio"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Crear una fecha ISO combinando fecha y hora
      const dateTimeString = `${formData.fecha}T${formData.hora}:00`
      const eventData = {
        ...formData,
        fecha: dateTimeString,
      }
      
      createEventMutation.mutate(eventData)
    }
  }

  // Generar días para el selector de fecha
  const generateCalendarDays = () => {
    const today = new Date()
    const days = []
    
    // Generar días para los próximos 2 meses
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    
    return days
  }
  
  const calendarDays = generateCalendarDays()

  // Generar horas para el selector de hora
  const generateTimeOptions = () => {
    const times = []
    
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        times.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    
    return times
  }
  
  const timeOptions = generateTimeOptions()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl max-w-2xl w-full mx-auto text-white overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold">Crear Nuevo Evento</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            
            {/* Organizador */}
            <div className="space-y-2">
              <label htmlFor="organizador" className="block text-sm font-medium">
                Organizador
              </label>
              <input
                type="text"
                id="organizador"
                name="organizador"
                value={formData.organizador}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white/10 border ${errors.organizador ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre del organizador"
              />
              {errors.organizador && <p className="text-red-500 text-xs">{errors.organizador}</p>}
            </div>
            
            {/* Fecha */}
            <div className="space-y-2 relative">
              <label htmlFor="fecha" className="block text-sm font-medium">
                Fecha
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha ? format(parseISO(formData.fecha), "dd/MM/yyyy") : ""}
                  readOnly
                  onClick={() => setShowDatePicker(prev => !prev)}
                  className={`w-full px-3 py-2 bg-white/10 border ${errors.fecha ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                  placeholder="Seleccionar fecha"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
              </div>
              {errors.fecha && <p className="text-red-500 text-xs">{errors.fecha}</p>}
              
              {/* Selector de fecha */}
              {showDatePicker && (
                <div className="absolute z-10 mt-1 bg-gray-800 rounded-md shadow-lg p-3 border border-white/20 w-72">
                  <div className="grid grid-cols-7 gap-1">
                    {["D", "L", "M", "X", "J", "V", "S"].map((day, i) => (
                      <div key={i} className="text-center text-xs font-medium text-white/70 py-1">
                        {day}
                      </div>
                    ))}
                    
                    {calendarDays.map((day, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, fecha: format(day, "yyyy-MM-dd") }))
                          setShowDatePicker(false)
                        }}
                        className={`text-sm rounded-full w-8 h-8 flex items-center justify-center
                          ${isToday(day) ? "bg-blue-500 text-white" : "hover:bg-white/20"}
                          ${format(day, "yyyy-MM-dd") === formData.fecha ? "ring-2 ring-blue-500" : ""}
                        `}
                      >
                        {format(day, "d")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Hora */}
            <div className="space-y-2 relative">
              <label htmlFor="hora" className="block text-sm font-medium">
                Hora
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  readOnly
                  onClick={() => setShowTimePicker(prev => !prev)}
                  className={`w-full px-3 py-2 bg-white/10 border ${errors.hora ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                  placeholder="Seleccionar hora"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
              </div>
              {errors.hora && <p className="text-red-500 text-xs">{errors.hora}</p>}
              
              {/* Selector de hora */}
              {showTimePicker && (
                <div className="absolute z-10 mt-1 bg-gray-800 rounded-md shadow-lg p-3 border border-white/20 w-48 max-h-60 overflow-y-auto">
                  <div className="space-y-1">
                    {timeOptions.map((time, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, hora: time }))
                          setShowTimePicker(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md
                          ${formData.hora === time ? "bg-blue-500 text-white" : "hover:bg-white/20"}
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Lugar */}
            <div className="space-y-2">
              <label htmlFor="lugar" className="block text-sm font-medium">
                Lugar
              </label>
              <input
                type="text"
                id="lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white/10 border ${errors.lugar ? 'border-red-500' : 'border-white/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ubicación del evento"
              />
              {errors.lugar && <p className="text-red-500 text-xs">{errors.lugar}</p>}
            </div>
            
            {/* Código */}
            <div className="space-y-2">
              <label htmlFor="codigo" className="block text-sm font-medium">
                Código
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Código del evento (opcional)"
              />
            </div>
          </div>
          
          {/* Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del evento"
            ></textarea>
          </div>
          
          {/* Soporte */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="soporte"
              name="soporte"
              checked={formData.soporte}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="soporte" className="ml-2 block text-sm">
              Requiere soporte técnico
            </label>
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createEventMutation.isPending}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors flex items-center"
            >
              {createEventMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Evento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
