import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import connectDb from "./utils/database";
import cors from "cors";

// init function buat start server
async function init() {
  // konek ke database
  const connect = await connectDb();
  console.log("database status: ", connect);

  
  const app = express();
  // middleware
  app.use(bodyParser.json()); // parse json
  app.use(cors()); // enable cors
  // semua route yang ada prefix /auth diarahin ke file authrouter
  app.use("/auth", authRouter);

  // tampilin ini kalau akses ke localhost:3000
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message:
      "auth service is running, use prefix /auth to access auth services",
      data: "OK",
    });
  });
  
  // start server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Auth service is running http://localhost:${PORT}`);
  });
}

// init
init();
