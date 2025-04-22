import { Router } from "express";
import { createEventoController } from "../controllers/eventos.controller.js";



const eventoRouter = Router()


eventoRouter.post("/evento", createEventoController)



export default eventoRouter;