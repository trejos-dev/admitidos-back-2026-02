import express from "express";

const app = express();

app.use(express.json()); /* Middleware para parsear el cuerpo de las solicitudes */



const PORT = Number(process.env.PORT);
const HOST = process.env.HOST;
const APP_NAME = process.env.APP_NAME;







/* const products = [
    { id: 1, name: "Product 1", price: 10.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 5.99 },
    { id: 4, name: "Product 4", price: 29.99 }
]; */


/* app.get("/api/products", (req, res) => {

    res.json({
        statusCode: 200,
        data: products
    });

}); */



/* Facultades disponibles */

const facultades = [

    {
        id: 1,
        name: "Facultad de Ingeniería"
    },

    {
        id: 2,
        name: "Facultad de Ciencias Sociales"
    },

    {
        id: 3,
        name: "Facultad de Ciencias de la Salud"
    },

    {
        id: 4,
        name: "Facultad de Arquitectura y Urbanismo"
    }

];


/* Programas existentes */

const programas = [

    {
        id: 1,
        codigo: "IS",
        facultadId: 1,
        name: "Ingeniería de Sistemas",
        nivel: "Pregrado",
        CreateBy: "System",
        createdAt: new Date().toISOString()
    },

    {
        id: 2,
        codigo: "IC",
        facultadId: 1,
        name: "Ingeniería Civil",
        nivel: "Pregrado",
        CreateBy: "System",
        createdAt: new Date().toISOString()
    },

    {
        id: 3,
        codigo: "II",
        facultadId: 1,
        name: "Ingeniería Industrial",
        nivel: "Pregrado",
        CreateBy: "System",
        createdAt: new Date().toISOString()
    },

    {
        id: 4,
        codigo: "PS",
        facultadId: 2,
        name: "Psicología",
        nivel: "Pregrado",
        CreateBy: "System",
        createdAt: new Date().toISOString()
    }

];
let nextProgramaId = 5;


const nivelesPermitidos = [
    "pregrado",
    "posgrado",
    "otro"
];


app.get("/api/facultades", (req, res) => {

    res.json({
        statusCode: 200,
        data: facultades
    });

});


app.get("/api/programas", (req, res) => {

    res.json({
        statusCode: 200,
        data: programas
    });

});

app.post("/api/programas/store", (req, res) => {

    console.log(req.body);

    const {
        facultadId,
        name,
        nivel
    } = req.body;

    if (!facultadId || !name || !nivel) {

        return res.status(422).json({

            statusCode: 422,

            success: false,

            message:
                "Los campos 'facultadId', 'name' y 'nivel' son obligatorios"

        });

    }


    const facultadExists =
        facultades.some(
            facultad =>
                facultad.id === Number(facultadId)
        );


    if (!facultadExists) { /* 404 Not Found */

        return res.status(404).json({

            statusCode: 404,

            success: false,

            message:
                `La facultad con id ${facultadId} no existe`

        });

    }

    if (
        !nivelesPermitidos.includes(
            nivel.toLowerCase()
        )
    ) {

        return res.status(422).json({

            statusCode: 422,

            success: false,

            message:
                "El nivel debe ser pregrado, posgrado u otro"

        });

    }

    const nombreNormalizado =
        name
            .trim()
            .toLowerCase();

    const programaExiste =
        programas.some(

            programa =>

                programa.facultadId ===
                Number(facultadId)

                &&

                programa.name
                    .trim()
                    .toLowerCase()
                === nombreNormalizado

        );


    if (programaExiste) {

        return res.status(409).json({

            statusCode: 409,

            success: false,

            message:
                "Ya existe un programa con ese nombre dentro de la facultad"

        });

    }


    const codigo =
        `PROG-${String(
            nextProgramaId
        ).padStart(4, "0")}`;


    const newPrograma = {
        id: nextProgramaId,
        codigo,
        facultadId: Number(facultadId),
        name: name.trim(),
        nivel: nivel.toLowerCase(),
        CreateBy: "System",
        createdAt: new Date().toISOString()

    };
    programas.push(newPrograma);
    nextProgramaId++;

    return res.status(201).json({
        statusCode: 201,
        success: true,
        message:
            "Programa creado correctamente",
        data:
            newPrograma

    });

});


app.listen(PORT, HOST, () => {

    console.log(APP_NAME);

    console.log(
        `Server is running on http://${HOST}:${PORT}`
    );

});          