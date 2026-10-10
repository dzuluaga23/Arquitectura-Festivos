const mongoose = require("mongoose");

class BaseDatos {
  static async conectar() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/festivos";
    try {
      await mongoose.connect(uri);
      console.log("Conectado a MongoDB: " + mongoose.connection.name);
    } catch (error) {
      console.log("Error conectando a MongoDB: " + error.message);
      process.exit(1);
    }
  }

  static async desconectar() {
    await mongoose.disconnect();
  }
}

module.exports = BaseDatos;
