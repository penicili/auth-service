import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import axios from "axios";
import { VEHICLE_SERVICE_URL } from "../utils/env";

interface DecryptedToken {
    username: string;
    email: string;
    role: string;
    exp: number;
}

export const gatewayController = {
    async authenticateToken (req: Request, res: Response){
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided or token invalid", data: null });
        }
        try {
            const decoded = jwt.verify(token, SECRET) as DecryptedToken;
            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({ message: "Token expired", data: null });
            }
            req.body.user = decoded; // Simpan user info ke request body
            return true;
        }
        catch{
            return res.status(401).json({ message: "Invalid token", data: null });
        }
    },
    async getVehicles(req: Request, res: Response) {
        try {
            const response = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles`, {
            });
            return res.status(200).json(response.data);
        } catch (error: any) { // Add type annotation to error
            console.error("Error fetching vehicles:", error);
            return res.status(500).json({
                message: "Failed to fetch vehicles",
                data: error,
            })

        }
    }
};