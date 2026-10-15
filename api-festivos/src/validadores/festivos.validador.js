const { param, body, validationResult } = require("express-validator");

class FestivosValidador {
  static revisarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }))
      });
    }
    next();
  };

  static anio = [
    param("anio")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("El año debe estar entre 1900 y 2099"),
    FestivosValidador.revisarErrores
  ];

  static id = [
    param("id").isMongoId().withMessage("El id no es válido"),
    FestivosValidador.revisarErrores
  ];

  static verificarFecha = [
    param("anio").isInt({ min: 1900, max: 2099 }),
    param("mes").isInt({ min: 1, max: 12 }),
    param("dia")
      .isInt({ min: 1, max: 31 })
      .bail()
      .custom((valor, { req }) => {
        const anio = Number(req.params.anio);
        const mes = Number(req.params.mes);
        const dia = Number(valor);
        const fecha = new Date(anio, mes - 1, dia);
        return fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
      }),
    (req, res, next) => {
      if (!validationResult(req).isEmpty()) {
        return res.status(200).type("text/plain").send("Fecha No válida");
      }
      next();
    }
  ];

  static camposFestivo = [
    body("idTipo")
      .isInt({ min: 1, max: 4 })
      .withMessage("El idTipo debe ser un número entre 1 y 4")
      .toInt(),
    body("nombre")
      .isString()
      .withMessage("El nombre es obligatorio")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío")
      .isLength({ max: 100 })
      .withMessage("El nombre no puede pasar de 100 caracteres"),
    body("mes")
      .if(body("idTipo").isIn([1, 2]))
      .isInt({ min: 1, max: 12 })
      .withMessage("El mes debe estar entre 1 y 12")
      .toInt(),
    body("dia")
      .if(body("idTipo").isIn([1, 2]))
      .isInt({ min: 1, max: 31 })
      .withMessage("El día debe estar entre 1 y 31")
      .bail()
      .custom((valor, { req }) => {
        const mes = Number(req.body.mes);
        const diasDelMes = new Date(2023, mes, 0).getDate();
        return Number(valor) <= diasDelMes;
      })
      .withMessage("El día no existe en ese mes")
      .toInt(),
    body("diasPascua")
      .if(body("idTipo").isIn([3, 4]))
      .isInt({ min: -100, max: 100 })
      .withMessage("Los días de pascua deben ser un entero entre -100 y 100")
      .toInt()
  ];

  static agregar = [...FestivosValidador.camposFestivo, FestivosValidador.revisarErrores];

  static modificar = [
    body("id").isMongoId().withMessage("El id no es válido"),
    ...FestivosValidador.camposFestivo,
    FestivosValidador.revisarErrores
  ];
}

module.exports = FestivosValidador;
