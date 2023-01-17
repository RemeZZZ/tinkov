import env from 'dotenv';

env.config();

export default (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (authorization !== process.env.PASSWORD) {
    res.status(401).send('unauthorized');

    return;
  }

  return next();
};
