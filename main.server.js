const express = require('express');
const request = require('request');

const app = express();
app.use(express.static(__dirname));

const authServer = 'http://localhost:3001';
const authenticate = function authenticate(req, res, next, path) {
  let response = req.pipe(request.get(`${authServer}${path}`));

  response.on('response', () => {
    const statusCode = response.responseContent.statusCode;

    const userIsAuthenticated = (statusCode === 200);
    if (userIsAuthenticated) {
      res.sendFile('./restricted.html', {root: '.'});
    } else {
      res.redirect('/');
    }
  });
};

app.post('/signin', (req, res, next) => {
  const path = '/auth';
  authenticate(req, res, next, path);
});

app.get('/restricted', (req, res, next) => {
  const path = '/session';
  authenticate(req, res, next, path)
});


app.listen(3000, () => {
  console.log('listening on 3000');
});
