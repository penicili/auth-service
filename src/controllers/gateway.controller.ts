import { Request, Response } from "express";
import UserModel from "../models/user.model";
import axios from "axios";
import { VEHICLE_SERVICE_URL, DRIVER_SERVICE_URL, ROUTE_SERVICE_URL } from "../utils/env";

// import types untuk request body and response
import { createVehicleRequest } from "../types/vehicleService.types";
import { createDriverRequest } from "../types/driverService.types";
import { CreateRouteRequest, UpdateRouteStatusRequest } from "../types/routeService.types";



export const gatewayController = {
    //  Vehicle Service Gateway Methods
    async getVehicles(req: Request, res: Response) {
        console.log('Fetching all vehicles from vehicle service');
    /** 
      #swagger.tags = ['Gateway - Vehicle Service']
      #swagger.summary = 'Get all vehicles'
      #swagger.security =[{
        "bearerAuth":[]}]
     */
        try {
            const serviceResponse = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles`, {
            });
            const response = serviceResponse.data;
            
            return res.status(200).json({
                data:response.data
            }
            );
        } catch (error: any) { // Add type annotation to error
            console.log("Error fetching vehicles:", error.message);
            console.error("Error fetching vehicles:");
            return res.status(404).json({
                message: error.message || "Vehicle Service is unavailable",
            })
        }
    },
    async createVehicle(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Vehicle Service']
      #swagger.summary = 'Create vehicle'
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/CreateVehicleSchema"}}
      #swagger.security =[{
        "bearerAuth":[]}]
     */
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
    /** 
      #swagger.tags = ['Gateway - Vehicle Service']
      #swagger.summary = 'Get vehicle by ID'
      #swagger.parameters['id'] = {
      in: 'query',
      description: 'Vehicle ID to fetch',
      required: true,
      type: 'string'}
      #swagger.security =[{
        "bearerAuth":[]}]
     */
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
    /** 
      #swagger.tags = ['Gateway - Vehicle Service']
      #swagger.summary = 'Get vehicle by ID'
      #swagger.parameters['id'] = {
      in: 'query',
      description: 'Vehicle ID to update',
      required: true,
      type: 'string'}
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/UpdateVehicleSchema"}}
      #swagger.security =[{
        "bearerAuth":[]}]
     */
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
    /** 
      #swagger.tags = ['Gateway - Vehicle Service']
      #swagger.summary = 'Get vehicle by ID'
      #swagger.parameters['id'] = {
      in: 'query',
      description: 'Vehicle ID to delete',
      required: true,
      type: 'string'}
      #swagger.security =[{
        "bearerAuth":[]}]
     */
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
    },

    // Driver Service Gateway Methods

    async getDrivers(req: Request, res: Response) {
        try {
            const serviceResponse = await axios.get(`${DRIVER_SERVICE_URL}/drivers/`)
            const response = serviceResponse.data;
            return res.status(200).json({
                message: "Drivers fetched successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error("Error fetching drivers:", error);
            return res.status(500).json({
                message: "Driver Service is unavailable",
                data: null,
            });
            
        }
    },    
    async createDriver(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Driver Service']
      #swagger.summary = 'Create driver and automatically register user account'
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/CreateDriverSchema"}}
      #swagger.security =[{
        "bearerAuth":[]}]
     */        try {            // First create the driver in the driver service
            // Extract only the fields we know the driver service needs
            const driverData: createDriverRequest = {
                name: req.body.name,
                email: req.body.email,
                license_number: req.body.license_number,
                status: req.body.status || 'available' 
            };
            
            // Log request data for debugging
            console.log("Creating driver with data:", JSON.stringify(driverData));
            
            const serviceResponse = await axios.post(`${DRIVER_SERVICE_URL}/drivers`, driverData);
            const driverResponse = serviceResponse.data;
            
            // Now create a user account for the driver
            try {
                // Create a username from driver name (simplified for example)
                const username = driverData.name.toLowerCase().replace(/\s+/g, '_') || 
                                driverData.email.split('@')[0];
                                  // Create user in auth service
                // We need to only include fields that are in the User model
                const userData = {
                    fullName: driverData.name,
                    email: driverData.email,
                    username: username,
                    role: "pengemudi", 
                    password: driverData.license_number // The model handles password encryption
                };
                
                console.log("Creating user account with data:", {
                    fullName: userData.fullName,
                    email: userData.email,
                    username: userData.username,
                    role: userData.role
                });
                
                const user = await UserModel.create(userData);
                
                console.log(`User account automatically created for driver: ${driverData.name}`, {
                    username: username,
                    driverId: driverResponse.data.id
                });
                
                return res.status(201).json({
                    message: "Driver created successfully with user account",
                    data: {
                        driver: driverResponse.data,
                        user: {
                            username: user.username,
                            email: user.email,
                            role: user.role
                        }
                    }
                });            } catch (userError: any) {
                console.error("Error creating user for driver:", userError.message);
                
                // Log validation errors if they exist
                if (userError.errors) {
                    console.error("Validation errors:", userError.errors);
                }
                
                // If it's a duplicate key error (username or email already exists)
                if (userError.code === 11000) {
                    console.error("Duplicate key error:", userError.keyValue);
                    return res.status(207).json({
                        message: "Driver created but user account creation failed - duplicate email or username",
                        data: {
                            driver: driverResponse.data,
                            userError: "A user with this email or username already exists"
                        }
                    });
                }
                
                // Return partial success - driver created but user account failed
                return res.status(207).json({
                    message: "Driver created but user account creation failed",
                    data: {
                        driver: driverResponse.data,
                        userError: userError.message
                    }
                });
            }        } catch (error: any) {
            console.error("Error creating driver:", error.message);
            
            // Log more detailed error information
            if (error.response) {
                console.error("Driver service error details:", {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                
                // Return the actual error from the driver service
                return res.status(error.response.status).json({
                    message: "Failed to create driver",
                    errorDetails: error.response.data,
                    error: error.message
                });
            }
            
            return res.status(500).json({
                message: "Failed to create driver", 
                error: error.message
            });
        }
    },
    async assignDriver(req: Request, res: Response){
        try {
            const serviceResponse = await axios.post(`${DRIVER_SERVICE_URL}/drivers/assign`, req.body,)
            const response = serviceResponse.data;
            console.log("Assigning driver with data:", JSON.stringify(req.body));
            return res.status(200).json({
                message: "Driver assigned successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error("Error assigning driver:", error);
            return res.status(500).json({
                message: "Failed to assign driver",
                data: null,
            });
            
        }
    },
    async getDriverById(req: Request, res: Response) {
        try {
            const serviceResponse = await axios.get(`${DRIVER_SERVICE_URL}/drivers/${req.query.id}`);
            const response = serviceResponse.data;
            return res.status(200).json({
                message: "Driver fetched successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error("Error fetching driver by ID:", error);
            return res.status(500).json({
                message: "Failed to fetch driver",
                data: null,
            });
            
        }
    },    
    async deleteDriverById(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Driver Service']
      #swagger.summary = 'Delete driver by ID and remove associated user account'
      #swagger.parameters['id'] = {
      in: 'query',
      description: 'Driver ID to delete',
      required: true,
      type: 'string'}
      #swagger.security =[{
        "bearerAuth":[]}]
     */
        const driverId = req.query.id as string;
        
        if (!driverId) {
            return res.status(400).json({
                message: "Driver ID is required",
                data: null,
            });
        }
        
        try {
            // First, get the driver details to find the email for user account deletion
            const driverResponse = await axios.get(`${DRIVER_SERVICE_URL}/drivers/${driverId}`);
            const driverData = driverResponse.data.data;
            
            // Save email to find associated user account
            const driverEmail = driverData.email;
            
            // Delete the driver from the driver service
            const serviceResponse = await axios.delete(`${DRIVER_SERVICE_URL}/drivers/${driverId}`);
            
            // Now find and delete the associated user account
            try {
                // Find user by email from driver data
                const user = await UserModel.findOne({ email: driverEmail });
                
                if (user) {
                    console.log(`Deleting user account for driver with email: ${driverEmail}`);
                    await UserModel.deleteOne({ email: driverEmail });
                    
                    return res.status(200).json({
                        message: "Driver and associated user account deleted successfully",
                        data: null
                    });
                } else {
                    console.log(`No user account found for driver with email: ${driverEmail}`);
                    return res.status(200).json({
                        message: "Driver deleted successfully, but no associated user account was found",
                        data: null
                    });
                }
            } catch (userError: any) {
                console.error("Error deleting user account:", userError.message);
                
                // Driver was deleted but user account deletion failed
                return res.status(207).json({
                    message: "Driver deleted but user account deletion failed",
                    error: userError.message
                });
            }
        } catch (error: any) {
            console.error("Error deleting driver:", error.message);
            
            // More detailed error logging
            if (error.response) {
                console.error("Driver service error details:", {
                    status: error.response.status,
                    data: error.response.data
                });
                
                return res.status(error.response.status).json({
                    message: "Failed to delete driver",
                    errorDetails: error.response.data,
                    error: error.message
                });
            }
            
            return res.status(500).json({
                message: "Failed to delete driver",
                data: null,
                error: error.message
            });
        }    },
    
    // Route Service Gateway Methods
    async getActiveRoutes(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Route Service']
      #swagger.summary = 'Get all active routes'
      #swagger.security = [{
        "bearerAuth":[]
      }]
     */
        try {
            console.log("Fetching active routes from route service");
            const serviceResponse = await axios.get(`${ROUTE_SERVICE_URL}/routes/active`);
            const response = serviceResponse.data;
            
            return res.status(200).json({
                message: "Active routes fetched successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error("Error fetching active routes:", error.message);
            
            if (error.response) {
                console.error("Route service error details:", {
                    status: error.response.status,
                    data: error.response.data
                });
                
                return res.status(error.response.status).json({
                    message: "Failed to fetch active routes",
                    errorDetails: error.response.data
                });
            }
            
            return res.status(500).json({
                message: "Route Service is unavailable",
                data: null
            });
        }
    },
    
    async getRouteById(req: Request, res: Response) {
        const routeId = req.query.id as string;
        
        if (!routeId) {
            return res.status(400).json({
                message: "Route ID is required",
                data: null
            });
        }
        
        try {
            console.log(`Fetching route with ID: ${routeId}`);
            const serviceResponse = await axios.get(`${ROUTE_SERVICE_URL}/routes/${routeId}`);
            const response = serviceResponse.data;
            
            return res.status(200).json({
                message: "Route fetched successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error(`Error fetching route with ID ${routeId}:`, error.message);
            
            if (error.response) {
                // If the route service returned an error response
                return res.status(error.response.status).json({
                    message: error.response.data.error || "Failed to fetch route",
                    errorDetails: error.response.data
                });
            }
            
            return res.status(500).json({
                message: "Failed to fetch route",
                data: null
            });
        }
    },
    
    async createRoute(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Route Service']
      #swagger.summary = 'Create a new route'
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/CreateRouteSchema"}
      }
      #swagger.security = [{
        "bearerAuth":[]
      }]
     */
        try {
            // Extract only the fields we need for the route service
            const routeData: CreateRouteRequest = {
                driver_id: req.body.driver_id,
                vehicle_id: req.body.vehicle_id,
                start_location: req.body.start_location,
                end_location: req.body.end_location,
                start_time: req.body.start_time,
                notes: req.body.notes
            };
            
            console.log("Creating route with data:", JSON.stringify(routeData));
            
            const serviceResponse = await axios.post(`${ROUTE_SERVICE_URL}/routes`, routeData);
            const response = serviceResponse.data;
            
            return res.status(201).json({
                message: "Route created successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error("Error creating route:", error.message);
            
            if (error.response) {
                // Handle specific error responses from the route service
                if (error.response.status === 404) {
                    return res.status(404).json({
                        message: "Driver or Vehicle not found",
                        errorDetails: error.response.data
                    });
                }
                
                return res.status(error.response.status).json({
                    message: "Failed to create route",
                    errorDetails: error.response.data
                });
            }
            
            return res.status(500).json({
                message: "Failed to create route",
                error: error.message
            });
        }
    },
    
    async updateRouteStatus(req: Request, res: Response) {
    /** 
      #swagger.tags = ['Gateway - Route Service']
      #swagger.summary = 'Update route status'
      #swagger.parameters['id'] = {
        in: 'query',
        description: 'Route ID to update',
        required: true,
        type: 'string'
      }
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/UpdateRouteStatusSchema"}
      }
      #swagger.security = [{
        "bearerAuth":[]
      }]
     */
        const routeId = req.query.id as string;
        
        if (!routeId) {
            return res.status(400).json({
                message: "Route ID is required",
                data: null
            });
        }
        
        try {
            const statusData: UpdateRouteStatusRequest = {
                status: req.body.status
            };
            
            console.log(`Updating route ${routeId} status to: ${statusData.status}`);
            
            const serviceResponse = await axios.put(
                `${ROUTE_SERVICE_URL}/routes/${routeId}/status`, 
                statusData
            );
            const response = serviceResponse.data;
            
            return res.status(200).json({
                message: "Route status updated successfully",
                data: response.data
            });
        } catch (error: any) {
            console.error(`Error updating route ${routeId} status:`, error.message);
            
            if (error.response) {
                if (error.response.status === 404) {
                    return res.status(404).json({
                        message: "Route not found",
                        errorDetails: error.response.data
                    });
                }
                
                return res.status(error.response.status).json({
                    message: "Failed to update route status",
                    errorDetails: error.response.data
                });
            }
            
            return res.status(500).json({
                message: "Failed to update route status",
                error: error.message
            });
        }
    }
};