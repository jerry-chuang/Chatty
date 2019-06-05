// server.js

const express = require('express');
const WebSocket = require('ws');

// Set the port to 3001
const PORT = 3001;
const uuidv1 = require('uuid/v1');

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function incoming(data){
    console.log('received message')
    let received = JSON.parse(data)
    received.id = uuidv1();
    console.log(received)
    wss.clients.forEach(function each(client){
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(received));
      }
    })

  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});