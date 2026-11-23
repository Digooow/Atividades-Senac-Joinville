import express from 'express';
import router from './source/Router/filmesRouter.js'

const app = express();
app.disable('x-powered-by');
const port = 3000;

app.use(express.json());
app.use('/api', router);


app.listen(port, () => {
    console.log(`Servidor rodando em https://localhost:${port}`)
});