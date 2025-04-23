import { createEventoRepositories, eliminarEventoRepositories, getEventosByIdRepositories, getEventosRepositories, modificarEventoRepositories } from "../repositories/eventos.repositories.js";



export const createEventoService = async (data) => {
    try {
        const codigo = '1234safd';
        const newEvento = await createEventoRepositories({
            ... data ,
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