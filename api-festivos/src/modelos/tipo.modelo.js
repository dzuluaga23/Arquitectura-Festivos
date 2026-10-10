const mongoose = require("mongoose");

const festivoSchema = new mongoose.Schema({
  dia: { type: Number, default: 0 },
  mes: { type: Number, default: 0 },
  nombre: { type: String, required: true, trim: true },
  diasPascua: { type: Number }
});

const tipoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    tipo: { type: String, default: "" },
    modoCalculo: { type: String, default: "" },
    festivos: [festivoSchema]
  },
  { collection: "tipos", versionKey: false }
);

module.exports = mongoose.model("Tipo", tipoSchema);
