import { Router } from "express";
import { createEventoController, deleteEventoController, getEventosByIdController, getEventosController, modificarEventoController } from "../controllers/eventos.controller.js";



const eventoRouter = Router()


eventoRouter.post("/evento", createEventoController)
eventoRouter.get("/eventos", getEventosController)
eventoRouter.get("/eventos/:id", getEventosByIdController)
eventoRouter.put("/eventos/:id", modificarEventoController)
eventoRouter.delete("/eventos/:id", deleteEventoController)


export default eventoRouter;