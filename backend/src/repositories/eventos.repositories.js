import prisma from "../config/db.js";



export const getEventosRepositories = async () => {
    try {
        const eventos = await prisma.evento.findMany()
        return eventos;
    } catch (error) {
        throw error;
    }
}

export const findEventoByHoraYLugarRepositories = async (hora_ini, hora_fin, lugar) => {
    try {
        const evento = await prisma.evento.findMany({
            where: {
                AND: [
                    {
                        lugar: lugar,
                    },
                    {
                        OR: [
                            {
                                AND: [
                                    { hora_ini: { lt: hora_fin } }, 
                                    { hora_fin: { gt: hora_ini } }, 
                                ],
                            },
                            {
                                AND: [
                                    { hora_ini: { lte: hora_ini } }, 
                                    { hora_fin: { gte: hora_fin } },
                                ],
                            },
                        ],
                    },
                ],
            },
        });
        return evento.length > 0; 
    } catch (error) {
        throw error;
    }
};


export const findEventoByLugarRepositories = async (lugar) => {
    try {
        const evento = await prisma.evento.findMany({
            where: {
                lugar: lugar
            }
        })
        return evento;
    } catch (error) {
        throw error;
    }
}

export const createEventoRepositories = async (data) => {
    try {
        const newEvento = await prisma.evento.create({
            data:{
                email: data.email,
                codigo: data.codigo,
                descripcion: data.descripcion,
                fecha: new Date(data.fecha), 
                hora_ini: data.hora_ini,
                hora_fin: data.hora_fin,
                lugar: data.lugar,
                organizador: data.organizador,
                soporte: data.soporte
            }
        })
        return newEvento;
    } catch (error) {
        throw error;
    }
}


export const getEventosByIdRepositories = async (id) => {
    try {
        const evento = await prisma.evento.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return evento;
    } catch (error) {
        throw error;
    }
}

export const modificarEventoRepositories = async (id, data) => {
    try {
        const evento = await prisma.evento.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email: data.email,
                descripcion: data.descripcion,
                fecha: data.fecha, 
                hora: data.hora,
                lugar: data.lugar,
                organizador: data.organizador,
                soporte: data.soporte
            }
        })
        return evento;
    } catch (error) {
        throw error;
    }
}

export const eliminarEventoRepositories = async (id) => {
    try {
        const evento = await prisma.evento.delete({
            where: {
                id: parseInt(id)
            }
        })
        return evento;
    } catch (error) {
        throw error;
    }
}