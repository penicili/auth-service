import express from "express";
import { gatewayController } from "../controllers/gateway.controller";
import authenticateToken from "../middlewares/authenticateToken";

const apiRouter = express.Router();


apiRouter.use(authenticateToken)
apiRouter.get("/vehicle/all", (req, res) => {
  gatewayController.getVehicles(req, res);
});
apiRouter.post("/vehicle/create", (req, res) => {
  gatewayController.createVehicle(req, res);
});
apiRouter.get("/vehicle/", (req, res) => {
  // Check if id query param exists and route accordingly
  if (req.query.id) {
    gatewayController.getVehicleById(req, res);
  } else {
    gatewayController.getVehicles(req, res);
  }
});
apiRouter.put("/vehicle/update", (req, res)=>{
    gatewayController.updateVehicle(req, res);
})
apiRouter.delete("/vehicle/delete", (req, res) => {
  gatewayController.deleteVehicleById(req, res);
});



export default apiRouter;
