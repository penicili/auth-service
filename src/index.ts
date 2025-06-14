import express, { Request, Response } from "express";
import apiRouter from "./routes/api";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import connectDb from "./utils/database";
import cors from "cors";
import docs from "./docs/route"

// init function buat start server
async function init() {
  // konek ke database
  const connect = await connectDb();
  console.log("database status: ", connect);
  const app = express();
  const PORT = 3001;
  // middleware
  app.use(bodyParser.json()); // parse json
  app.use(cors());

  // semua route yang ada prefix /auth diarahin ke file router
  app.use("/api", apiRouter)
  app.use("/auth", authRouter);
  docs(app)
  // tampilin ini kalau akses ke localhost:3000
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message:
        "auth service is running, use prefix /auth to access auth services",
      data: "OK",
    });
  });
  // start server
  app.listen(PORT, () => {
    console.log(`Auth service is running http://localhost:${PORT}`);
  });
}


// init
init()