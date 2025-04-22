import { createEventoService } from "../services/eventos.service.js";



export const createEventoController = async (req, res) => {
    try {
        const { email, descripcion, fecha, hora, lugar, organizador, soporte } = req.body;
        const newEvento = await createEventoService({ email, descripcion, fecha, hora, lugar, organizador, soporte });
        return res.status(201).json(newEvento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


