import swaggerAutogen from "swagger-autogen";

// Use absolute paths to avoid relative path issues
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/auth.ts", "../routes/api.ts"];

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
      },
      CreateDriverSchema: {
        name: "John Driver",
        email: "driver@example.com",
        license_number: "SIM123456789",
        status: "Available"
      }
    },
  },
};

const swaggerDoc = swaggerAutogen({
  openapi: "3.0.0",
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
});

// Generate swagger JSON file
swaggerDoc(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully");
});
