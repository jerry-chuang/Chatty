const express = require('express');
const WebSocket = require('ws');

const PORT = 3001;
const uuidv1 = require('uuid/v1');

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server });

function Broadcast(message) {
  wss.clients.forEach(function each(client){
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  })
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  //Broadcast user count to all clients
  Broadcast(JSON.stringify({type:'incomingCount', count:wss.clients.size}));
  // Randomly pick a color and sends it to the client on connect
  let colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
  ws.send(JSON.stringify({type:'incomingColor', color: colors[Math.floor(Math.random()*colors.length)]}));

  ws.on('message', function incoming(data){
    console.log('received message')
    let received = JSON.parse(data)
    switch (received.type){
      case 'postMessage':
        received.type = 'incomingMessage'
        received.id = uuidv1();
        Broadcast(JSON.stringify(received))
        break;
      case 'postNotification':
        received.type = 'incomingNotification'
        received.id = uuidv1();
        console.log('broadcasting notification', received)
        Broadcast(JSON.stringify(received))
        break;
    }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    //broadcast usercount again on close
    Broadcast(JSON.stringify({type:'incomingCount', count:wss.clients.size}))
  });
});
