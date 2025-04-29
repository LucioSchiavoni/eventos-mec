import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { X, CalendarIcon, Clock } from "lucide-react"
import { createEvento } from "../../api/eventos"
import { toast } from "react-toastify"
import UIAlert from "../utils/UiAlert"
import {Select, SelectItem} from "@heroui/select";


interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
}

interface EventFormData {
  email: string
  fecha: string
  hora_ini: string
  hora_fin: string
  lugar: string
  soporte: boolean
  telefono: string
  organizador: string
  descripcion: string
  codigo: string
}

export default function EventForm({ isOpen, onClose, initialDate = new Date() }: EventFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<EventFormData>({
    email: "",
    fecha: format(initialDate, "yyyy-MM-dd"),
    hora_ini: format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
    hora_fin: format(new Date().setHours(10, 0, 0, 0), "HH:mm"),
    lugar: "",
    soporte: false,
    telefono: "",
    organizador: "",
    descripcion: "",
    codigo: "",
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState<"hora_ini" | "hora_fin" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uialert, setUiAlert] = useState<{ message: string; active: boolean }>({
    message: "",
    active: false,
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      const response = await createEvento(eventData);
      return response
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      if (data.success) {
        toast.success(data.message);
        onClose(); 
      }else{
        setUiAlert({message: data.message, active:true})
        setTimeout(() => {
          setUiAlert({ message: "", active: false });
        }, 60000);
      }
      setFormData({
        email: "",
        fecha: format(new Date(), "yyyy-MM-dd"),
        hora_ini: format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
        hora_fin: format(new Date().setHours(10, 0, 0, 0), "HH:mm"),
        lugar: "",
        soporte: false,
        telefono: "",
        organizador: "",
        descripcion: "",
        codigo: "",
      });
   },
    onError: (error: any) => {
      toast.error(error.message || "Error inesperado");
      setTimeout(() => {
        setUiAlert({ message: "", active: false });
      }, 6000);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = "El email es obligatorio"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria"
    if (!formData.hora_ini) newErrors.hora_ini = "La hora de inicio es obligatoria";
    if (!formData.hora_fin) newErrors.hora_fin = "La hora de finalización es obligatoria";
    else if (formData.hora_ini && formData.hora_fin && formData.hora_ini >= formData.hora_fin) {
      newErrors.hora_fin = "La hora de finalización debe ser posterior a la hora de inicio";
    }
    if (!formData.lugar) newErrors.lugar = "El lugar es obligatorio"
    if (!formData.organizador) newErrors.organizador = "El organizador es obligatorio"

    if (!formData.telefono) {
    } else if (!/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe contener solo números";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
       if (validateForm()) {
      const dateTimeStart = `${formData.fecha}T${formData.hora_ini}:00`;

  
      const eventData = {
        ...formData,
        fecha: dateTimeStart,
        hora_fin: formData.hora_fin,
        hora_ini: formData.hora_ini,
      };
      createEventMutation.mutate(eventData);
    }
    } catch (error) {
      console.log(error);
    }finally{
      setUiAlert({message: "", active:false})
    }
   
  };

  const closeAlert = () => {
    setUiAlert((prev) => ({ ...prev, active: false }))
  }


  const generateCalendarDays = () => {
    const today = new Date()
    const days = []


    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }

    return days
  }

  const calendarDays = generateCalendarDays()


  const generateTimeOptions = () => {
    const times = []

    for (let hour = 8; hour <= 23; hour++) {
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
   

    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl max-w-2xl w-full mx-auto text-white overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold">Crear Nuevo Evento</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        {
  uialert.active && (
   <UIAlert active={uialert.active} message={uialert.message} onClose={closeAlert} />
  )
}
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
                className={`w-full px-3 py-2 bg-white/10 border ${errors.email ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-red-700 font-semibold">{errors.email}</p>}
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
                className={`w-full px-3 py-2 bg-white/10 border ${errors.organizador ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre del organizador"
              />
              {errors.organizador && <p className="text-red-700 font-semibold">{errors.organizador}</p>}
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
                  onClick={() => setShowDatePicker((prev) => !prev)}
                  className={`w-full px-3 py-2 bg-white/10 border ${errors.fecha ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                  placeholder="Seleccionar fecha"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
              </div>
              {errors.fecha && <p className="text-red-700 font-semibold">{errors.fecha}</p>}

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
                          setFormData((prev) => ({ ...prev, fecha: format(day, "yyyy-MM-dd") }))
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
          {/* Hora de inicio */}
          <div className="space-y-2 relative">
  <label htmlFor="hora_ini" className="block text-sm font-medium">
    Hora de inicio
  </label>
  <div className="relative">
    <input
      type="text"
      id="hora_ini"
      name="hora_ini"
      value={formData.hora_ini}
      readOnly
      onClick={() => setShowTimePicker((prev) => (prev === "hora_ini" ? null : "hora_ini"))}
      className={`w-full px-3 py-2 bg-white/10 border ${errors.hora_ini ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
      placeholder="Seleccionar hora de inicio"
    />
    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
  </div>
  {errors.hora_ini && <p className="text-red-700 font-semibold">{errors.hora_ini}</p>}

  {/* Selector de hora para hora_ini */}
  {showTimePicker === "hora_ini" && (
    <div className="absolute z-10 mt-1 bg-gray-800 rounded-md shadow-lg p-3 border border-white/20 w-48 max-h-60 overflow-y-auto">
      <div className="space-y-1">
        {timeOptions.map((time, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, hora_ini: time })); 
              setShowTimePicker(null);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md ${
              formData.hora_ini === time ? "bg-blue-500 text-white" : "hover:bg-white/20"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

{/* Hora de finalización */}
<div className="space-y-2 relative">
  <label htmlFor="hora_fin" className="block text-sm font-medium">
    Hora de finalización
  </label>
  <div className="relative">
    <input
      type="text"
      id="hora_fin"
      name="hora_fin"
      value={formData.hora_fin}
      readOnly
      onClick={() => setShowTimePicker((prev) => (prev === "hora_fin" ? null : "hora_fin"))}
      className={`w-full px-3 py-2 bg-white/10 border ${errors.hora_fin ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
      placeholder="Seleccionar hora de finalización"
    />
    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
  </div>
  {errors.hora_fin && <p className="text-red-700 font-semibold">{errors.hora_fin}</p>}

  {/* Selector de hora para hora_fin */}
  {showTimePicker === "hora_fin" && (
    <div className="absolute z-10 mt-1 bg-gray-800 rounded-md shadow-lg p-3 border border-white/20 w-48 max-h-60 overflow-y-auto">
      <div className="space-y-1">
        {timeOptions.map((time, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, hora_fin: time })); 
              setShowTimePicker(null);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md ${
              formData.hora_fin === time ? "bg-blue-500 text-white" : "hover:bg-white/20"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Select className="max-w-xs" label="Selecciona la sala">
              <SelectItem>
               Sala Alba Roballo (Piso 9)
              </SelectItem>
              <SelectItem>
                Planta Baja (Piso 1)
              </SelectItem>
            </Select>
          </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label htmlFor="lugar" className="block text-sm font-medium">
                Telefono
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white/10 border ${errors.telefono ? "border-red-500" : "border-white/20"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Numero de contacto"
              />
              {errors.lugar && <p className="text-red-700 font-semibold">{errors.telefono}</p>}
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar Evento"
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