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

// Route service gateway endpoints - updated to match Route Service API exactly
apiRouter.get("/routes/active", authenticateToken, (req, res) => {
  gatewayController.getActiveRoutes(req, res);
});

apiRouter.get("/routes/:id", authenticateToken, (req, res) => {
  gatewayController.getRouteById(req, res);
});

apiRouter.post("/routes", authorizeManager, (req, res) => {
  gatewayController.createRoute(req, res);
});

apiRouter.put("/routes/:id/status", authenticateToken, (req, res) => {
  gatewayController.updateRouteStatus(req, res);
});

apiRouter.get("/jawa", (req,res) => {
  res.status(200).json({
    message: "Jawa is a fictional character from Star Wars",
    data: {
      name: "Jawa",
      description: "A species of small, rodent-like humanoids native to the desert planet Tatooine."
    }
  });
})
export default apiRouter;
