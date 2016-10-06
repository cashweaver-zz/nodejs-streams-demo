const express = require('express');
const request = require('request');

const app = express();
const user = {
  username: 'cat',
  password: 'dog',
  signedIn: false
}

app.get('/auth', (req, res) => {
  let data = '';
  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      const credentials = data.split('&').map(keyValue => keyValue.split('=')[1])
      console.log(credentials);
      const username = credentials[0];
      const password = credentials[1];
      if (username === user.username && password === user.password) {
        user.signedIn = true;
        res.status(200).end();
      } else {
        res.status(400).end();
      }
    });
});

app.get('/session', (req, res) => {
  req
    .on('data', () => { /* noop */ })
    .on('end', () => {
      if (user.signedIn) {
        res.status(200).end();
      } else {
        res.status(400).end();
      }
    });

});

app.listen(3001, () => {
  console.log('listening on 3001');
});
