import express from "express"
import router from './src/router/pessoa.js'
import database from './src/config/database.js'

const app = express();
app.use(express.json());

app.use("/api", router)
const port = 3000

database.db
    .sync({ force: false })
    .then((_) => {

        app.listen(port, (req, res) => {

            console.log(`Servidor rodando em http://localhost:${port}`)

        })
    }
    )
    .catch((e) => {
        console.log("Erro ao conectar com o banco de dados: ", e)
    })



