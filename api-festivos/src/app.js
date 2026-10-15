const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const festivosRutas = require("./rutas/festivos.rutas");

class Aplicacion {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
    this.configurarErrores();
  }

  configurarMiddlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }

  configurarRutas() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/api", festivosRutas);
    this.app.get("/", (req, res) => {
      res.json({ mensaje: "API Festivos activa", documentacion: "/api-docs" });
    });
  }

  configurarErrores() {
    this.app.use((req, res) => {
      res.status(404).json({ mensaje: "Recurso no encontrado" });
    });

    this.app.use((err, req, res, next) => {
      if (err.type === "entity.parse.failed") {
        return res.status(400).json({ mensaje: "El cuerpo de la petición no es un JSON válido" });
      }
      console.error(err);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    });
  }
}

module.exports = new Aplicacion().app;
