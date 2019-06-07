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
  //Broadcast user count to all clients
  wss.clients.forEach(function each(client){
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({type:'incomingCount', count:wss.clients.size}));
    }
  })
  // Array with some colors
  let colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
  ws.send(JSON.stringify({type:'incomingColor', color: colors[Math.floor(Math.random()*colors.length)]}))



  ws.on('message', function incoming(data){
    console.log('received message')
    let received = JSON.parse(data)
    if (received.type === 'postMessage'){
      received.type = 'incomingMessage'
      received.id = uuidv1();
      wss.clients.forEach(function each(client){
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(received));
        }
      })
    }
    if (received.type === 'postNotification'){
      received.type = 'incomingNotification'
      received.id = uuidv1();
      console.log('broadcasting notification', received)
      wss.clients.forEach(function each(client){
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(received));
        }
      })
    }



  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    //broadcast usercount again on close
    wss.clients.forEach(function each(client){
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({type:'incomingCount', count:wss.clients.size}));
      }
    })
  });
});