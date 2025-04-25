import clienteAxios from "../config/axios";




export const getEventos = async () => {
    try {
        const res = await clienteAxios.get("/eventos");
        return res.data;
    } catch (error) {
        console.log(error);
    }
}


export const createEvento = async (evento: any) => {
    try {
        const res = await clienteAxios.post("/evento", evento);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Error al crear el evento");
    }
}