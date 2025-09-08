// Centralized Swagger configuration for reuse in app and tooling
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clickthulu API",
      version: "1.0.0",
      description: "API documentation for Clickthulu backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your access token",
        },
      },
    },
  },
  // Scan nested route files as well
  apis: ["./routes/**/*.js"],
};

export default swaggerOptions;


