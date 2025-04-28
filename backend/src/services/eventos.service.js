import { sendEmailService } from "../middlewares/sendEmail.js";
import { createEventoRepositories, eliminarEventoRepositories, findEventoByHoraYLugarRepositories, getEventosByIdRepositories, getEventosRepositories, modificarEventoRepositories } from "../repositories/eventos.repositories.js";


export const createEventoService = async (data) => {
    try {

        const existEvento = await findEventoByHoraYLugarRepositories(data.hora_ini, data.hora_fin, data.lugar);
        if(existEvento) {
            return {message: "Ya existe un evento en ese rango de horas", success: false};
        }
        const codigo = Math.random().toString(36).substring(2, 10);
        const newEvento = await createEventoRepositories({
            ... data,
            codigo: codigo
        });
        await sendEmailService(data.email, data.lugar, data.hora_ini, data.fecha, codigo);
        return {message: "Evento creado con exito", success: true};
    } catch (error) {
        throw error;
    }
}



export const getEventosService = async () => {
    try {
        const eventos = await getEventosRepositories();
        return eventos;
    } catch (error) {
        throw error;
    }
}


export const getEventosByIdService = async (id) => {
    try {
        const evento = await getEventosByIdRepositories(id);
        return evento;
    } catch (error) {
        throw error;
    }
}


export const modificarEventoService = async (id, data) => {
    try {
        const evento = await modificarEventoRepositories(id, data);
        return evento;
    } catch (error) {
        throw error;
    }
}

export const deleteEventoService = async (id) => {
    try {
        const evento = await eliminarEventoRepositories(id);
        return evento;
    } catch (error) {
        throw error;
    }
}