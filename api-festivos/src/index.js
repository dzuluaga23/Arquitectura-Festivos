require("dotenv").config();
const app = require("./app");
const BaseDatos = require("./config/baseDatos");

const puerto = process.env.PORT || 3000;

async function iniciar() {
  await BaseDatos.conectar();
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
    console.log(`Documentación en http://localhost:${puerto}/api-docs`);
  });
}

iniciar();
