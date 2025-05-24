import express from "express";
import dummy from "../controllers/dummy.controller";
import { authController } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/dummy", async (req, res, next) => {
  try {
    await Promise.resolve(dummy.dummy(req, res));
  } catch (err) {
    next(err);
  }
});
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/login", (req, res, next) => {
  authController.login(req, res).catch(next);
});

export default authRouter;
