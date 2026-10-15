# API Festivos

API REST en Express JS + MongoDB (Mongoose) para verificar festivos de Colombia,
obtener los festivos de un año y administrarlos (CRUD). Arquitectura por capas,
escrita en clases, con documentación en Swagger.

## Instalación

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Swagger: `http://localhost:3000/api-docs`

## Endpoints (prefijo /api)

| Método | Ruta                                   | Qué hace                                              |
|--------|-----------------------------------------|--------------------------------------------------------|
| GET    | `/festivos/verificar/:anio/:mes/:dia`   | `Es Festivo`, `No es festivo` o `Fecha No válida`       |
| GET    | `/festivos/obtener/:anio`               | Lista `[{ festivo, fecha }]` de un año                  |
| GET    | `/tipos`                                | Tipos de festivo con sus festivos                       |
| GET    | `/festivos/listar`                      | Todos los festivos guardados                            |
| GET    | `/festivos/buscar/:id`                  | Un festivo por id                                       |
| POST   | `/festivos/agregar`                     | Agrega un festivo                                       |
| POST   | `/festivos/modificar`                   | Modifica un festivo                                     |
| DELETE | `/festivos/eliminar/:id`                | Elimina un festivo                                      |

Ejemplo para agregar un festivo (tipo 2, se traslada al siguiente lunes):

```json
{ "idTipo": 2, "nombre": "Virgen de Chiquinquirá", "dia": 9, "mes": 7 }
```

Los tipos 3 y 4 no llevan `dia` ni `mes`, llevan `diasPascua`:

```json
{ "idTipo": 4, "nombre": "Festivo de prueba", "diasPascua": 49 }
```
