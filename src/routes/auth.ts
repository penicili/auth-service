import express from "express";
import dummy from "../controllers/dummy.controller";
import { authController } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/dummy", dummy.dummy);
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/login", (req, res, next) => {
  authController.login(req, res).catch(next);
});

export default authRouter;
