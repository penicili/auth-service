import express from "express";
import { gatewayController } from "../controllers/gateway.controller";
import authenticateToken from "../middlewares/authenticateToken";

const apiRouter = express.Router();

// Apply authenticateToken middleware only to this specific route
apiRouter.get("/vehicles", authenticateToken, (req, res) => {
  gatewayController.getVehicles(req, res);
});



export default apiRouter;
