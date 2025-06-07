import express from "express";
import { gatewayController } from "../controllers/gateway.controller";
import authenticateToken from "../middlewares/authenticateToken";
import authorizeManager from "../middlewares/authorizeManager";

const apiRouter = express.Router();

// vehicle service gateway endpoint
apiRouter.get("/vehicle/all", authenticateToken, (req, res) => {
  gatewayController.getVehicles(req, res);
});
apiRouter.post("/vehicle/create", authorizeManager, (req, res) => {
  gatewayController.createVehicle(req, res);
});
apiRouter.get("/vehicle/", authenticateToken, (req, res) => {
  if (req.query.id) {
    gatewayController.getVehicleById(req, res);
  } else {
    gatewayController.getVehicles(req, res);
  }
});
apiRouter.put("/vehicle/update", authorizeManager, (req, res) => {
  gatewayController.updateVehicle(req, res);
});
apiRouter.delete("/vehicle/delete", authorizeManager, (req, res) => {
  gatewayController.deleteVehicleById(req, res);
});

// Driver service gateway endpoint
apiRouter.get("/driver/", authenticateToken, (req, res) => {
  if (req.query.id) {
    gatewayController.getDriverById(req, res);
  } else {
    gatewayController.getDrivers(req, res);
  }
});
apiRouter.post("/driver/create", authorizeManager, (req, res) => {
  gatewayController.createDriver(req, res);
});
apiRouter.post("/driver/assign", authorizeManager, (req, res) => {
  gatewayController.assignDriver(req, res);
})
apiRouter.delete("/driver/delete", authorizeManager, (req, res) => {
  gatewayController.deleteDriverById(req, res)
});
// Add any additional routes here

export default apiRouter;
