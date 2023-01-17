import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import cors from './middlewares/cors.js';
import { queue } from './store/index.js';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Подключаем логгер запросов
app.use(requestLogger);

app.use(cors);

app.use(router);

app.use(errorLogger);

app.listen(3103, () => {
  console.log('App listening on port 3103');
});

setInterval(() => {
  const func = queue.shift();

  if (func) {
    func();
  }
}, 200);
