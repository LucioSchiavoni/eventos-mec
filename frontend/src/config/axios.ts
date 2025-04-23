import axios from 'axios'



const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_URL,
    withCredentials: true
})

// clienteAxios.interceptors.request.use((config) => {
//     const token = useAuthStore.getState().token;

//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });
  


export default clienteAxios;