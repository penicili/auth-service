import express from "express";
import dummyController from "../controllers/dummy.controller";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.get("/dummy", dummyController.dummy);
router.post("/register", authController.register);

export default router;
