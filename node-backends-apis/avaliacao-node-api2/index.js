import express from 'express';
import router from './source/Router/filmesRouter.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);


app.listen(port, (req, res) => {
    console.log(`Servidor rodando em https://localhost:${port}`)
});