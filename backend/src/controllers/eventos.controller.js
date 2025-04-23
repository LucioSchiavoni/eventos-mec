import { createEventoService, deleteEventoService, getEventosByIdService, getEventosService } from "../services/eventos.service.js";



export const createEventoController = async (req, res) => {
    try {
        const { email, descripcion, fecha, hora, lugar, organizador, soporte } = req.body;
        const newEvento = await createEventoService({ email, descripcion, fecha, hora, lugar, organizador, soporte });
        return res.status(201).json(newEvento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const getEventosController = async (req, res) => {
    try {
        const eventos = await getEventosService();
        return res.status(200).json(eventos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const getEventosByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await getEventosByIdService(id);
        return res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const modificarEventoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, descripcion, fecha, hora, lugar, organizador, soporte } = req.body;
        const evento = await modificarEventoService(id, { email, descripcion, fecha, hora, lugar, organizador, soporte });
        return res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteEventoController = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await deleteEventoService(id);
        return res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}