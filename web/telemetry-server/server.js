const WebSocket = require('ws');

// pull in the mqtt receiver
const TelemeteryReceiver = require('./TelemetryReceiver');

const wss = new WebSocket.Server({ port: 8080 });

// start and forget
const ts = new TelemeteryReceiver(process.env.IOT_HUB_CONNECTION);
ts.run();

// when a client connects...
wss.on('connection', function connection(ws) {
    console.log(`connected ${ws}`);
    ws.on('message', function incoming(message) {
        // print any messages received from the client, to the console for debug
        console.log('received: %s', message);
      });

    ws.on('error',(err) => {
      console.log(err);
    });
  
  // poll the telemetry receiver at some interval and send the data
  // to the websocket client
  setInterval(() => {
    const {temperature,humidity} = ts.getTelemetry();
    ws.send(JSON.stringify({temperature,humidity}));
  },5000);
});
