const festivosRepositorio = require("../repositorios/festivos.repositorio");
const {
  obtenerDomingoRamos,
  agregarDias,
  siguienteLunes
} = require("../servicios/ServicioFechas");

class FestivosControlador {
  listarTipos = async (req, res, next) => {
    try {
      const tipos = await festivosRepositorio.listarTipos();
      res.json(tipos);
    } catch (error) {
      next(error);
    }
  };

  listar = async (req, res, next) => {
    try {
      const tipos = await festivosRepositorio.listarTipos();
      const festivos = tipos.flatMap((tipo) =>
        tipo.festivos.map((festivo) => this.armarFestivo(tipo, festivo))
      );
      res.json(festivos);
    } catch (error) {
      next(error);
    }
  };

  buscar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const resultado = await festivosRepositorio.buscarFestivo(id);
      if (!resultado) {
        return res.status(404).json({ mensaje: `No existe el festivo con id=${id}` });
      }
      res.json(this.armarFestivo(resultado.tipo, resultado.festivo));
    } catch (error) {
      next(error);
    }
  };

  verificar = async (req, res, next) => {
    try {
      const anio = Number(req.params.anio);
      const mes = Number(req.params.mes);
      const dia = Number(req.params.dia);
      const festivos = await this.obtenerFestivosDelAnio(anio);
      const fecha = this.formatearFecha(new Date(anio, mes - 1, dia));
      const esFestivo = festivos.some((festivo) => festivo.fecha === fecha);
      res.type("text/plain").send(esFestivo ? "Es Festivo" : "No es festivo");
    } catch (error) {
      next(error);
    }
  };

  obtener = async (req, res, next) => {
    try {
      const festivos = await this.obtenerFestivosDelAnio(Number(req.params.anio));
      res.json(festivos.map((f) => ({ festivo: f.nombre, fecha: f.fecha })));
    } catch (error) {
      next(error);
    }
  };

  agregar = async (req, res, next) => {
    try {
      const { idTipo, nombre } = req.body;
      const tipos = await festivosRepositorio.listarTipos();
      const tipo = tipos.find((t) => t.id === idTipo);
      if (!tipo) {
        return res.status(404).json({ mensaje: `No existe el tipo con id=${idTipo}` });
      }
      if (this.nombreRepetido(tipos, nombre)) {
        return res.status(409).json({ mensaje: `Ya existe un festivo con el nombre ${nombre}` });
      }
      const datos = this.armarDatos(idTipo, req.body);
      const nuevo = await festivosRepositorio.agregar(idTipo, datos);
      res.json(this.armarFestivo(tipo, nuevo));
    } catch (error) {
      next(error);
    }
  };

  modificar = async (req, res, next) => {
    try {
      const { id, idTipo, nombre } = req.body;
      const tipos = await festivosRepositorio.listarTipos();
      const tipo = tipos.find((t) => t.id === idTipo);
      if (!tipo) {
        return res.status(404).json({ mensaje: `No existe el tipo con id=${idTipo}` });
      }
      const existente = await festivosRepositorio.buscarFestivo(id);
      if (!existente) {
        return res.status(404).json({ mensaje: `No existe el festivo con id=${id}` });
      }
      if (this.nombreRepetido(tipos, nombre, id)) {
        return res.status(409).json({ mensaje: `Ya existe un festivo con el nombre ${nombre}` });
      }
      const datos = this.armarDatos(idTipo, req.body);
      const modificado = await festivosRepositorio.modificar(id, idTipo, datos);
      res.json(this.armarFestivo(tipo, modificado));
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const eliminado = await festivosRepositorio.eliminar(id);
      if (!eliminado) {
        return res.status(404).json({ mensaje: `No existe el festivo con id=${id}` });
      }
      res.json({ mensaje: `Se eliminó el festivo con id=${id}` });
    } catch (error) {
      next(error);
    }
  };

  calcularFecha(idTipo, festivo, anio) {
    if (idTipo === 1) {
      return new Date(anio, festivo.mes - 1, festivo.dia);
    }
    if (idTipo === 2) {
      return siguienteLunes(new Date(anio, festivo.mes - 1, festivo.dia));
    }
    const domingoPascua = agregarDias(obtenerDomingoRamos(anio), 7);
    const fecha = agregarDias(domingoPascua, festivo.diasPascua);
    if (idTipo === 4) {
      return siguienteLunes(fecha);
    }
    return fecha;
  }

  formatearFecha(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }

  async obtenerFestivosDelAnio(anio) {
    const tipos = await festivosRepositorio.listarTipos();
    const festivos = [];
    for (const tipo of tipos) {
      for (const festivo of tipo.festivos) {
        const fecha = this.calcularFecha(tipo.id, festivo, anio);
        festivos.push({ nombre: festivo.nombre, fecha: this.formatearFecha(fecha) });
      }
    }
    festivos.sort((a, b) => a.fecha.localeCompare(b.fecha));
    return festivos;
  }

  armarFestivo(tipo, festivo) {
    return {
      id: String(festivo._id),
      idTipo: tipo.id,
      tipo: tipo.tipo,
      nombre: festivo.nombre,
      dia: festivo.dia,
      mes: festivo.mes,
      diasPascua: festivo.diasPascua
    };
  }

  armarDatos(idTipo, cuerpo) {
    const datos = { nombre: cuerpo.nombre };
    if (idTipo === 1 || idTipo === 2) {
      datos.dia = cuerpo.dia;
      datos.mes = cuerpo.mes;
    } else {
      datos.dia = 0;
      datos.mes = 0;
      datos.diasPascua = cuerpo.diasPascua;
    }
    return datos;
  }

  nombreRepetido(tipos, nombre, idActual) {
    return tipos.some((tipo) =>
      tipo.festivos.some(
        (f) => f.nombre.toLowerCase() === nombre.toLowerCase() && String(f._id) !== idActual
      )
    );
  }
}

module.exports = new FestivosControlador();
