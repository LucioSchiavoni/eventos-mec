import clienteAxios from "../config/axios";




export const getEventos = async () => {
    try {
        const res = await clienteAxios.get("/eventos");
        return res.data;
    } catch (error) {
        console.log(error);
    }
}