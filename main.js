const express = require('express');
const app = express();
const path = require('path');

const DIR = 'src';

const html = path.join(__dirname, DIR, 'index.html');
const handler = (req, res) => res.sendFile(html);
const routes = ['/', '/about/', '/posts', '/posts/*', '/tags', '/tag/*'];

routes.forEach(route => app.get(route, handler));

const json = path.join(__dirname, DIR, 'posts.json');
app.get('/posts.json', (req, res) => res.sendFile(json));

app.use(express.static(DIR));
//app.use('/static', express.static(path.join(__dirname, DIR)));

app.listen(3000, function () {
  console.log('Running at http://localhost:3000');
});