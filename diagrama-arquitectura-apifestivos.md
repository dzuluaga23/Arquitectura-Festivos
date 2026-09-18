```mermaid
graph TD
    subgraph ClientLayer [Capa de Cliente]
        Client[Cliente Web Movil o Postman]
    end

    subgraph PresentationLayer [Capa de Presentacion]
        Index[index.js / app.js]
        Routes[festivos.rutas.js]
        Validators[festivos.validador.js]
    end

    subgraph BusinessLayer [Capa de Negocio]
        Controllers[festivos.controlador.js]
    end

    subgraph DataAccessLayer [Capa de Datos]
        Repositories[festivos.repositorio.js]
    end

    subgraph PersistenceLayer [Capa de Persistencia]
        DB[(Base de Datos MongoDB)]
    end

    Client -->|1. Peticion HTTP| Index
    Index -->|2. Delega| Routes
    Routes -->|3. Valida| Validators
    Validators -->|4. Pasa filtro| Controllers
    Controllers -->|5. Solicita| Repositories
    Repositories -->|6. Consulta| DB

    DB -.->|7. Retorna| Repositories
    Repositories -.->|8. Procesa| Controllers
    Controllers -.->|9. Respuesta JSON| Client

    style ClientLayer fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style PresentationLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style BusinessLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style DataAccessLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style PersistenceLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px