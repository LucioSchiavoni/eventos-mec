import prisma from "../config/db.js";



// const getEventosRepositories = async () => {
//     try {
//         const eventos = await prisma.evento.findMany()
//         return eventos;
//     } catch (error) {
//         throw error;
//     }
// }

export const createEventoRepositories = async (data) => {
    try {
        const newEvento = await prisma.evento.create({
            data:{
                email: data.email,
                codigo: data.codigo,
                descripcion: data.descripcion,
                fecha: data.fecha, 
                hora: data.hora,
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
