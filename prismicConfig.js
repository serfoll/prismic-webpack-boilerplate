import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import * as prismic from '@prismicio/client';

const repoName = process.env.PRISMIC_ENDPOINT;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

const routes = [{ type: 'home', path: '/' }];

export default prismic.createClient(repoName, {
  fetch,
  accessToken,
  routes,
});
