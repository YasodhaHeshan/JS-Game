const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (socket) => {
    clients.add(socket);
    
    // Assign player number
    const playerNumber = clients.size;
    socket.send(JSON.stringify({ type: 'player-number', number: playerNumber }));

    socket.on('message', (message) => {
        // Broadcast the message to all other clients
        const data = JSON.parse(message);
        clients.forEach((client) => {
            if (client !== socket) {
                client.send(JSON.stringify(data));
            }
        });
    });

    socket.on('close', () => {
        clients.delete(socket);
    });
}); 