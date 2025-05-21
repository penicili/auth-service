import express, { Request, Response } from "express";
import router from "./routes/api"

const app = express();
const PORT = 3000;


// semua route yang ada prefix /auth diarahin ke file router
app.use('/auth', router)
// tampilin ini kalau akses ke localhost:3000
app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({
        message: "auth service is running, use prefix /auth to access auth services",
        data: "OK"
    })
})

app.listen(PORT, () =>{
    console.log(`Auth service is running http://localhost:${PORT}`);
})