# Step 3 Create a Websocket Server with the TelemetryReceiver

Creating a nodejs websocket server is very simple. I used the ['ws' node module](https://github.com/websockets/ws). 
I started with their 'Simple Server' example, modified to to get data from the TelemetryReceiver.

```javascript
const WebSocket = require('ws');

// pull in the mqtt receiver (stored locally)
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
  // to the websocket client. I'm still using the
  // simulated data at this point
  setInterval(() => {
    const {temperature,humidity} = ts.getTelemetry();
    console.log({temperature,humidity});
    ws.send(JSON.stringify({temperature,humidity}));
  },5000);
});

```

## TESTING
For testing, I spawned this server on a local port 8080. A client webpage that wants to connect
has to be able to connect to this port at whatever url the server is exposing. This might change
once I deploy to a cloud client, but for testing with the browser and this server running on the same
computer it works with 'localhost'.

When running the test, don't forget to setup the host keys in your environment or whatever.
1. Start the IOT Device simulated_device application on its target system. it should connect to the Azure IOT hub. 
2. Start this server running on any nodejs platform that can connect to the IOT hub. It will print some output once device messages are received.
3. Run the following websocket test client on the same system as 2. It should print the data sent by the device.

You can start the IOT Device program and the telemetry-server in any order. Either side will wait for connections. The only caveat is that
you can't start the websocket test client before the websocket server (telemetry-server) or it will error out when it tries to connect.

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  
});

ws.on('message', function incoming(data) {
  console.log(data);
});

```


Go to [Step 4](../step4/README.md).