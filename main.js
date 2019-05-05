const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const path = require('path');

const DIR = 'dist';

const html = path.join(__dirname, DIR, 'index.html');
const handler = (req, res) => res.sendFile(html);
const routes = ['/', '/about/', '/posts', '/posts/*', '/tags', '/tag/*'];

routes.forEach(route => app.get(route, handler));

const css = path.join(__dirname, DIR, 'styles.css');
app.get('/styles.css', (req, res) => res.sendFile(css));

const js = path.join(__dirname, DIR, 'script.js');
app.get('/script.js', (req, res) => res.sendFile(js));

app.use(express.static(DIR));
// app.use('/', express.static(path.join(__dirname, DIR)));

const API = ['http://localhost:3000', 'https://api.pixelhandler.dev'][0];

app.use('/api', proxy({target: API, changeOrigin: true}));

app.listen(8080, function () {
  console.log('Running at http://localhost:8080');
});
