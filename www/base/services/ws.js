"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENTS = void 0;
exports.handleWSS = handleWSS;
const ws_1 = require("ws");
const emitter_1 = require("./emitter");
const ws_2 = require("../middlewares/ws");
exports.CLIENTS = new Map();
function handleWSS(server, configs) {
    const wss = new ws_1.WebSocketServer({ noServer: true });
    wss.on('connection', function connection(ws, req) {
        handleWsConnection(ws, req);
    });
    server.on('upgrade', function upgrade(req, socket, head) {
        socket.on('error', console.error);
        (0, ws_2.wsAuthMiddleware)(req, null, function next(err) {
            if (err) {
                console.log('sending unauth', err);
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
            socket.removeListener('error', console.error);
            wss.handleUpgrade(req, socket, head, function done(ws) {
                wss.emit('connection', ws, req);
            });
        }, configs);
    });
    wss.on('error', console.error);
}
function handleWsConnection(ws, req) {
    const userId = req.userId;
    if (userId)
        exports.CLIENTS.set(userId, ws);
    ws.on('message', (data) => {
        emitter_1.emitter.emit('ws-message', ws, data);
    });
    ws.on('close', () => {
        if (userId) {
            notifyClientsOfStatus(userId, 'offline');
            exports.CLIENTS.delete(userId);
        }
    });
    ws.on('error', console.error);
    ws.send(JSON.stringify({ message: 'Hello from server!' }));
}
function notifyClientsOfStatus(userId, status) {
    exports.CLIENTS.get(userId).send(JSON.stringify({ type: 'status', _id: userId, status }));
}
