import dotenv from 'dotenv';
dotenv.config();

//path
import path from 'path';
import { fileURLToPath } from 'url';

//express
import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
import logger from 'morgan';

//prismic
import * as prismicH from '@prismicio/helpers';
import client from './prismicConfig.js';

//link resolver
import LinkResolver from './resolvers/linkResolver.js';

//app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//MIDDLEWARES
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//favicon
app.use(
  '/favicon.ico',
  express.static(__dirname + '/shared/images/favicon.ico')
);
app.use(
  '/favicon-32x32.png',
  express.static(__dirname + '/shared/images/favicon-32x32.png')
);
app.use(
  '/favicon-16x16.png',
  express.static(__dirname + '/shared/images/favicon-16x16.png')
);

//error handling
app.use((err, req, res, next) => {
  console.error(err.message);
  //common server error status code
  if (!err.statusCode) {
    err.statusCode = 500;
    res.status(500).render('error', { error: err });
  }
  console.error(err.shouldRedirect);
});

//view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//connect to prismic client
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
    LinkResolver,
  };
  next();
});

const handleRequest = async () => {
  const navigation = await client.getSingle('navigation');
  const footer = await client.getSingle('footer');

  return {
    navigation,
    footer,
  };
};

//paths
app.get('/', async (req, res) => {
  const defaults = await handleRequest();
  const home = await client.getSingle('home');

  res.render('pages/home', {
    ...defaults,
    home,
  });
});

app.get('/about', async (req, res) => {
  const defaults = await handleRequest();
  const about = await client.getSingle('about');

  res.render('pages/home', {
    ...defaults,
    about,
  });
});

//404
app.get('*', (req, res, next) => {
  setImmediate(() => {
    let err = new Error("Page doesn't exist");
    err.statusCode = 404;
    res.render('pages/404');
    next(err);
  });
});

//connect to server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  const devURL = `http://localhost:${port}`;
  console.log(`App is listening at ${devURL}`);
});
