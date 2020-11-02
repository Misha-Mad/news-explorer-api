const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(auth);

app.use(usersRouter);
app.use(articlesRouter);
app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server listening on port ${PORT}`);
});