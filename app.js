const express = require('express');
const app = express();
const http = require('http').createServer(app);



function startServer() {
  http.listen(3000, () => {
    console.log('Server started');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
  });

  app.use(express.static(__dirname + '/client'));


};
startServer()
