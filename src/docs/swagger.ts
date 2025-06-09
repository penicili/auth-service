import swaggerAutogen from "swagger-autogen";
import path from "path";

// Make sure to output to the same directory as this file
const outputFile = path.resolve(__dirname, "swagger_output.json");
const endpointsFiles = [
  path.resolve(__dirname, "../routes/auth.ts"), 
  path.resolve(__dirname, "../routes/api.ts")
];

const doc = {
  info: {
    version: "v1.0.0",
    title: "Auth Service API Documentation",
    description: "Documentation for the Authentication Service API",
  },
  servers: [
    {
      url: "http://localhost:3001/auth",
      description: "Auth Endpoints",
    },
    {
      url: "http://localhost:3001/api",
      description: "Gateway Endpoints",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Gateway - Vehicle Service",
      description: "endpoints ke vehicle service"
    },
    {
      name: "Gateway - Driver Service",
      description: "endpoints ke driver service"
    },
    {
      name: "Gateway - Route Service",
      description: "endpoints ke route service"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {      LoginRequest: {
        userIdentifier: "jakaCrossOrigin",
        password: "Hahahihi123",
      },
      LoginManagerRequest: {
        userIdentifier: "fleetmanager", // Use this for testing manager login
        password: "Pass123"
      },
      RegisterRequest: {
        fullName: "Joko Tromol Depan",
        email: "jakaCORS@yopmail.com",
        username: "jakaCrossOrigin",
        role: "pengemudi",
        password: "Hahahihi123",
        confirmPassword: "Hahahihi123",
      },
      CreateVehicleSchema: {
        type: "car",
        plate_number: "B 6924 ZY",
        status: "Available",
      },      UpdateVehicleSchema: {
        type: "car",
        plate_number: "B 6924 ZY",
        status: "InUse",
      },      CreateDriverSchema: {
        name: "John Driver",
        email: "driver@example.com",
        license_number: "SIM123456789",
        status: "Available"
      },
      CreateRouteSchema: {
        driver_id: 1,
        vehicle_id: 1,
        start_location: "Jakarta",
        end_location: "Bandung",
        start_time: "2025-06-08T08:00:00Z",
        notes: "Express delivery"
      },
      UpdateRouteStatusSchema: {
        status: "InProgress"
      }
    },
  },
};

// Use the simpler invocation pattern that works in your other project
swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully");
});
