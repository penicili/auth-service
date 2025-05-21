import { Request, Response } from "express";

// type definition
// type untuk request body register
type TRegisterRequest = {
    fullName: string;
    email: string;
    username: string;
    role: string;
    password: string;
}

export default {
    // controller untuk register
    register (req: Request, res: Response) {
        // destructure body dari request
        const  {
            fullName,
            email,
            username,
            role,
            password
        } = req.body as TRegisterRequest;
        // return response testing
        res.status(200).json({
            message: "Register Success",
            data: {
                fullName,
                email,
                username,
                role,
                password
            }
        })
    }
}