const Tipo = require("../modelos/tipo.modelo");

class FestivosRepositorio {
  async listarTipos() {
    return Tipo.find().sort({ id: 1 }).lean();
  }

  async buscarFestivo(id) {
    const tipo = await Tipo.findOne({ "festivos._id": id }).lean();
    if (!tipo) return null;
    const festivo = tipo.festivos.find((f) => String(f._id) === String(id));
    return { tipo, festivo };
  }

  async agregar(idTipo, datos) {
    const tipo = await Tipo.findOne({ id: idTipo });
    tipo.festivos.push(datos);
    await tipo.save();
    return tipo.festivos[tipo.festivos.length - 1].toObject();
  }

  async modificar(id, idTipo, datos) {
    const tipoActual = await Tipo.findOne({ "festivos._id": id });
    if (!tipoActual) return null;
    const festivoActual = tipoActual.festivos.id(id);

    if (tipoActual.id === idTipo) {
      festivoActual.set(datos);
      await tipoActual.save();
      return festivoActual.toObject();
    }

    const tipoNuevo = await Tipo.findOne({ id: idTipo });
    tipoNuevo.festivos.push({ ...datos, _id: festivoActual._id });
    tipoActual.festivos.pull(festivoActual._id);
    await tipoNuevo.save();
    await tipoActual.save();
    return tipoNuevo.festivos[tipoNuevo.festivos.length - 1].toObject();
  }

  async eliminar(id) {
    const tipo = await Tipo.findOne({ "festivos._id": id });
    if (!tipo) return false;
    const festivo = tipo.festivos.id(id);
    tipo.festivos.pull(festivo._id);
    await tipo.save();
    return true;
  }
}

module.exports = new FestivosRepositorio();
