const WebSocket = require('ws');
const TelemeteryReceiver = require('./TelemetryReceiver');

const wss = new WebSocket.Server({ port: 8080 });

const ts = new TelemeteryReceiver(process.env.IOT_HUB_CONNECTION);
ts.run();

wss.on('connection', function connection(ws) {
    console.log(`connected ${ws}`);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

    ws.on('error',(err) => {
      console.log(err);
    });
  
  setInterval(() => {
    const {temperature,humidity} = ts.getTelemetry();
    console.log({temperature,humidity});
    ws.send(JSON.stringify({temperature,humidity}));
  },5000);
});

