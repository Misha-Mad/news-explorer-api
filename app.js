require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validationCreateUser, validationLoginUser } = require('./middlewares/requestValidation');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { notFoundResourceMessage } = require('./utils/constants');
const { limiter } = require('./middlewares/limiter');
const { DB_CONN_DEV } = require('./utils/config');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_CONN : DB_CONN_DEV, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLoginUser, login);

app.use(auth);

app.use(routes);
app.all('*', () => {
  throw new NotFoundError(notFoundResourceMessage);
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
