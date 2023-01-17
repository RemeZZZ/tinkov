const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://localhost:5500',
  'http://127.0.0.1:5500',
  'vds2370188.my-ihor.ru',
  'http://185.87.51.76',
  'http://vds2370188.my-ihor.ru',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

export default (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);

    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }
  return next();
};
