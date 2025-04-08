const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients = new Map();
function broadcastMessage(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  const clientId = Date.now();
  clients.set(clientId, ws);
  console.log(`user connected: ${clientId}`);

  broadcastMessage({ event: 'user_connected', clientId, message: 'new user joined chat' });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`received from ${clientId}:`, data);
      broadcastMessage({ event: 'message', clientId, message: data.message });
    } catch (error) {
      console.error('invalid message format:', message);
      ws.send(JSON.stringify({ event: 'error', message: 'invalid JSON format' }));
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`user disconnected: ${clientId}`);
    broadcastMessage({ event: 'user_disconnected', clientId, message: 'user left chat' });
  });
});

const PORT = process.env.WS_PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at ws://localhost:${PORT}`);
});
