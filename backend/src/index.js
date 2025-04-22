import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import eventoRouter from './routes/eventos.routes.js'


dotenv.config()


const app = express()

const PORT = process.env.PORT


const opcionesCors = {
    origin: process.env.FRONTEND_URL_DEV,
    credentials: true 
};

app.use(cors(opcionesCors))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/", eventoRouter)

app.get("/", (req,res) => {
    res.json("Index")

})

app.listen(PORT, () =>  { 
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})