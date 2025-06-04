import jwt from "jsonwebtoken";
import { SECRET } from "../utils/env";
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import axios from "axios";
import { VEHICLE_SERVICE_URL } from "../utils/env";

// import types untuk request body and response
import { 
    createVehicleRequest, 
} from "../types/vehicleService.types";

interface DecryptedToken {
    username: string;
    email: string;
    role: string;
    exp: number;
}

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: DecryptedToken;
    }
  }
}

export const gatewayController = {
    //  Vehicle Service Gateway Methods
    async getVehicles(req: Request, res: Response) {
        try {
            const serviceResponse = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles`, {
            });
            const response = serviceResponse.data;
            
            return res.status(200).json({
                data:response.data
            }
            );
        } catch (error: any) { // Add type annotation to error
            console.error("Error fetching vehicles:", error);
            return res.status(500).json({
                message: "Failed to fetch vehicles",
                data: error,
            })
        }
    },
    async createVehicle(req: Request, res: Response) {
        const requestBody: createVehicleRequest={
            type: req.body.type,
            plate_number: req.body.plate_number,
            status: req.body.status 
        }
        try {
            const serviceResponse = await axios.post(`${VEHICLE_SERVICE_URL}/vehicles`, requestBody, {
            });
            const response = serviceResponse.data;
            return res.status(201).json({
                message: "Vehicle created successfully",
                data: response.data,
            });
        } catch (error: any) { 
            console.error("Error creating vehicle:", error);}
            return res.status(500).json({
                message: "Failed to create vehicle",
                data: null,
            })
    },    
    async getVehicleById(req: Request, res: Response){
        const vehicleId = req.query.id as string;  
        if (!vehicleId) {
            return res.status(400).json({
                message: "Vehicle ID is required",
                data: null,
            });
        }
        
        try {
            const serviceResponse = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles/${vehicleId}`);
            const response = serviceResponse.data;
            
            return res.status(200).json({
                data: response.data
            });
        } catch (error: any) {
            console.error("Error fetching vehicle by ID:", error);
            
            // Handle specific error codes from the vehicle service
            if (error.response) {
                return res.status(error.response.status).json({
                    message: error.response.data.message || "Failed to fetch vehicle",
                    data: null,
                });
            }
            
            return res.status(500).json({
                message: "Failed to fetch vehicle",
                data: null,
            });
        }
    },
    async updateVehicle(req: Request, res: Response) {
        const vehicleId = req.query.id;
        console.log("Updating vehicle with ID:", vehicleId);
        try {
            const serviceResponse = await axios.put(`${VEHICLE_SERVICE_URL}/vehicles/${vehicleId}`, req.body, {
            })
            const response = serviceResponse.data
            return res.status(200).json({
                message: "Vehicle updated successfully",
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to update vehicle",
                data: null
            })
        }

    },
    async deleteVehicleById(req: Request, res: Response) {
        const vehicleId = req.query.id as string;
        if (!vehicleId){
            return res.status(400).json({
                message: "Vehicle ID is required",
                data: null,
            });
        }
        try {
            const serviceResponse = await axios.delete(`${VEHICLE_SERVICE_URL}/vehicles/${vehicleId}`);
            const response = serviceResponse.data;
            return res.status(200).json({
                message: "Vehicle deleted successfully",
                data: null
            });
        } catch (error: any) {
            console.error("Error deleting vehicle:", error);
            return res.status(500).json({
                message: "Failed to delete vehicle",
                data: null,
            });
            
        }
    }
};