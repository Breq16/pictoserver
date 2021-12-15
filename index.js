import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

const channels = {};

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data, isBinary) {
    const payload = JSON.parse(data);

    if (payload.type === "join") {
      channels[payload.channel] = channels[payload.channel] || [];
      channels[payload.channel].push(ws);
      ws.send(
        JSON.stringify({
          type: "joined",
          room: payload.channel,
        })
      );
    } else if (payload.type === "message") {
      channels[payload.channel].forEach(function (client) {
        client.send(
          JSON.stringify({
            type: "message",
            room: payload.channel,
            message: payload.message,
          })
        );
      });
    }
  });
});
