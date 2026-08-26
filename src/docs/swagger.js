import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Catalogo de Jogos",
    version: "1.0.0",
    description: "API REST em memoria para catalogo de jogos"
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  }
};

export default swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ["./app.js", "./src/routes/*.js"]
});
