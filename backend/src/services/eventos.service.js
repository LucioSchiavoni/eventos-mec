import { createEventoRepositories } from "../repositories/eventos.repositories.js";



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