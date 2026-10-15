const express = require("express");
const festivosControlador = require("../controladores/festivos.controlador");
const FestivosValidador = require("../validadores/festivos.validador");

class FestivosRutas {
  constructor() {
    this.router = express.Router();
    this.configurar();
  }

  configurar() {
    this.router.get("/tipos", festivosControlador.listarTipos);

    this.router.get("/festivos/listar", festivosControlador.listar);
    this.router.get("/festivos/buscar/:id", FestivosValidador.id, festivosControlador.buscar);
    this.router.get(
      "/festivos/verificar/:anio/:mes/:dia",
      FestivosValidador.verificarFecha,
      festivosControlador.verificar
    );
    this.router.get("/festivos/obtener/:anio", FestivosValidador.anio, festivosControlador.obtener);

    this.router.post("/festivos/agregar", FestivosValidador.agregar, festivosControlador.agregar);
    this.router.put(
      "/festivos/modificar",
      FestivosValidador.modificar,
      festivosControlador.modificar
    );
    this.router.delete(
      "/festivos/eliminar/:id",
      FestivosValidador.id,
      festivosControlador.eliminar
    );
  }
}

module.exports = new FestivosRutas().router;
