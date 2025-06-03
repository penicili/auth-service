import swaggerAutogen from "swagger-autogen";

// Use absolute paths to avoid relative path issues
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/auth.ts"];

const doc = {
  info: {
    version: "v1.0.0",
    title: "Auth Service API Documentation",
    description: "Documentation for the Authentication Service API",
  },
  servers: [
    {
      url: "http://localhost:3001/auth",
      description: "Local Development Server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        userIdentifier: "jakaCrossOrigin",
        password: "Hahahihi123",
      },
      RegisterRequest: {
        fullName: "Joko Tromol Depan",
        email: "jakaCORS@yopmail.com",
        username: "jakaCrossOrigin",
        role: "pengemudi",
        password: "Hahahihi123",
        confirmPassword: "Hahahihi123",
      },
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
