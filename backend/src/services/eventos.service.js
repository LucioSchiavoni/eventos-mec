import { createEventoRepositories, eliminarEventoRepositories, getEventosByIdRepositories, getEventosRepositories, modificarEventoRepositories } from "../repositories/eventos.repositories.js";



export const createEventoService = async (data) => {
    try {

        const existEvento = await getEventosByIdRepositories(data.hora_ini, data.hora_fin);
        if(existEvento) {
            return {error: "Ya existe un evento en ese rango de horas"};
        }
        const codigo = Mth.random().toString(36).substring(2, 10);
        const newEvento = await createEventoRepositories({
            ... data,
            codigo: codigo
        });
        return {success: "Evento creado con exito", evento: newEvento};
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