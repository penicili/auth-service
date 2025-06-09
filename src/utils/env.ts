// package dotenv buat nge-load environment variables dari file .env
import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL || "";
export const SECRET = process.env.SECRET || "";
export const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL || "http://localhost:8000/api/";
export const DRIVER_SERVICE_URL = process.env.DRIVER_SERVICE_URL || "http://localhost:8001/api/";
export const ROUTE_SERVICE_URL = process.env.ROUTE_SERVICE_URL || "http://localhost:8002/api/";