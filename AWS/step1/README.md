# STEP 1 - Set Up And Test AWS IoT Device
-------------------------------------------

## Create an account on Amazon AWS
  
If you don't already have one, go to [Amazon AWS](https://aws.amazon.com) and create a free account.
You will get a $200.00 credit for 30 days, and a bunch of its services free for one year, plus another bunch
that are always free. Check out the list here : [Amazon AWS Free Tier](https://aws.amazon.com/free).
Most important for this project, the IoT feature (what this project uses) is always free for 250,000 messages (sent and received) per month.

## Prerequisites
  
Before we deploy to the target IoT device, you can do the setup and test using your workstation (Linux, Mac or Windows). The setup requires one of several programming languages to be available. I am going to use JavaScript and NodeJS version 10. So its best to go ahead and have that installed. Any node from version 6 to 12.

## Go to the 'Portal'
  
Once you have an account, sign in to the AWS Management Console. In the search box type 'internet of things'. Select 'IoT Core. It will probably start
on the 'Monitor' screen. At the bottom of the list on the left is 'Learn'. Click that. This gives you some choices. 
You might want to do the tutorial first but you don't need that for this process. 

## Proceed with the Setup

This process is sort of easy to follow but it isn't quite as step-by-step as the Azure Quickstart. 

Here's the process. It will guide you step by step but here are some hints to help out.
  - click 'View connection options' in the 'Connect to AWS IoT' box.
  - click 'Get started' in the 'Configuring a device' box.
  - It shows you the three steps in the setup process. Click 'Get Started'
  - It asks you to choose a platform. Although the actual Nodejs code is platform independent, their startup code has a shell script that is dependent on either Linux or Windows, so you have to pick.
    - I chose the Node.js SDK.
    - It says you need to be able to connect to the internet (duh)
    - Once you have selected platform and SDK, clock 'Next'
  - It will ask you to give your device a name. I prefer some sort of naming convention, so I named it 'aws-iot-device-bbb' (bbb for beaglebone blue). The only rule here is that device names need to be unique in your account.
  - It offers to let you do optional configuration but you can skip this for now.
  - click 'Next step'.
  - You see 'Download a connection kit' and it shows a summary of what you are getting. If you are happy with that, click the download button. It will download a zip file. Don't do anything with that yet.
  - click 'Next Step'
  - You will see a list of 3 steps to get an example running. Pick a place to unzip the SDK then follow the three steps. They are different on Windows or Linux. 
    - You need to use Powershell on Windows, bash or compatible on Linux.
  - I recommend that after you unzip the SDK file into an empty directory, but before you run the shell script, go into the directory you unzipped it in and run 'npm init' and select defaults. This creates a package.json file that will be updated by the shell script. Otherwise the script doesn't create one. You can skip this and it all works, but this gives you an updated package.json that shows the dependencies you need going forward. 
  - Go ahead and follow the instructions and it shoud all work. Don't close the web page!
  - On Windows when you set the ExecutionPolicy, it will ask if you want to do this. The answer is yes. This allows unsigned scripts to be run. The '-Scope Process' argument means that this restriction is lifted only for this instance of powershell. 
  - **if it is working you will see output on the browser screen that has the instructions.**
  - On the screen you can type in a message and it should print out on the terminal that is running the script.
  - **Important : the unzip gives you 3 security files: a private key, a public key and a certificate. DO NOT COMMIT THESE FILES TO A GITHUB REPO! or any other public site. Otherwise a crook could access the device and AWS service**
  - when you are happy with this, click 'Done'. 

## Hoist The Example 

If you look at the script you just ran, you will see it does not have a .js file in the root that it runs. Instead it reaches deep into the node_modules directory and finds the example
code in there and runs it. This is a bit inconvenient to use, so the next thing I did was hoist the example code up to the root of this directory and refactor the code to get it to work from there. Heres what I did:
  - copy device-example.js from [working directory]\node_modules\aws-iot-device-sdk\examples to [working directory].
  - edit the 'require' statements as follows:
  
  ```javascript
    //app deps
  // FROM const deviceModule = require('..').device;
  // TO
  const deviceModule = require("aws-iot-device-sdk").device;

  // FROM const cmdLineProcess = require('./lib/cmdline');
  // TO
  const cmdLineProcess = require('./node_modules/aws-iot-device-sdk/examples/lib/cmdline');

  ```
   - copy the startup script to a different name, I called it run.cmd (on Windows).
   - remove everything but the node command line
   - change the long path to the 'device-example.js' to just the name of the file. 
   - run it. In my case I just typed '.\run.cmd' in powershell. You need the .\ in powershell, like in Linux. But you can switch to cmd.exe and just run it there.
   - It should connect BUT now you don't see the output or input. Here's what to do next..

## AWS Test Support

  AWS Iot core provides a way to test device telemetry from the browser. 

  - go back to the browser, click 'Services' at the top and select 'IoT core'. 
  - in the left hand list, click 'Test'.
  - in the 'Subscription topic' box, type 'topic_2' and click 'Subscribe to topic'. 'topic_2' is the tag for the data the device-example.js uplinks.
  - You should see some output on the web page now.
  - The display switches automatically to a 'publish' dialog. In the text box, type 'topic_1' which is the tag the device-example.js is subscribed to. 
  - You should see the message on the terminal.
  - Click 'Monitor' in the list on the left. It will show some graphs and you shoud see a couple of dots in 'Messages published' and some activity in the circle charts.
  - It both of these work, you are done here for now.

## Deploy to an IoT device

Since I forked the repo all I need to do is log in to my Beaglebone, clone the repo, and set up the Quickstart simulated device as above in 'Send Simulated Telemetry'.
I had Node version 10 installed on my BeagleBone. I just set up the device connection string as an environment variable, did "npm install" in the simulated-device directory,
and ran the program. I used my workstation as the receiving end, running the ReadDeviceToCloudMessages.js there. It worked without modification.
This reinforces that you can do much of your development for the IoT device on  your workstation and only deploy to the IoT device when ready. 

## Appendix A The Protocol

This example uses the Message Queue Telemetry Transport

 [MQTT.ORG](https://mqtt.org)

*MQTT stands for MQ Telemetry Transport. It is a publish/subscribe, extremely simple and lightweight messaging protocol, designed for constrained devices and low-bandwidth, high-latency or unreliable networks. The design principles are to minimise network bandwidth and device resource requirements whilst also attempting to ensure reliability and some degree of assurance of delivery. These principles also turn out to make the protocol ideal of the emerging “machine-to-machine” (M2M) or “Internet of Things” world of connected devices, and for mobile applications where bandwidth and battery power are at a premium.*


### Authentication and Encryption

Encryption is NOT part of the base MQTT protocol standard. If encryption is required, then the connections should use MQTT over SSL. So don't send anything on a plain  MQTT protocol that is secret, personal or you otherwise don't want other folks to know. This is not a problem with the Azure toolkit.

Here's my understanding of what security is by default in the Azure IoT samples. 
 - The messages are authenticated using a token generated by a shared secret key in the connection string. So you must have the secret key in order to talk to the IoT hub endpoint. This ensures that only messages from endpoints that have the secret key are accepted.
 - The Azure MQTT transport is encrypted with TLS by default. This prevents traffic sniffing. [Azure IoT Hub Security](https://docs.microsoft.com/en-us/azure/iot-fundamentals/iot-security-ground-up). I also verified using Wireshark, just in case I didn't understand the documentation. 


## Appendix B - SimulatedDevice.js

This is what runs on the IoT device. It connects to the IoT Hub service and sends periodic messages. It actually is a decent baseline for my app, just adding the right data to it.

```javascript
// Using the Azure CLI:
// don't hard code the connection string. use an environment variable
var connectionString = process.env.IOT_DEVICE_CONNECTION;

// Using the Node.js Device SDK for IoT Hub:
// The sample connects to a device-specific MQTT endpoint on your IoT Hub.
var Mqtt         = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message      = require('azure-iot-device').Message;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

// Create a message and send it to the IoT hub every second
setInterval(function(){
  // Simulate telemetry.
  var temperature = 20 + (Math.random() * 15);

  // the message itself is JSON
  var message = new Message(JSON.stringify({
    temperature: temperature,
    humidity: 60 + (Math.random() * 20)
  }));

  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
  message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');

  console.log('Sending message: ' + message.getData());

  // Send the message once every second
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 1000);
```
## Appendix C - ReadDeviceToCloudMessages.js

This is what runs on a client somewhere. It connects to the IoT Hub service and sends periodic messages. Again it is a decent baseline for my app, just adding the right data to it.

```javascript
// Using the Azure CLI:
// az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
const connectionString = process.env.IOT_HUB_CONNECTION;

// Using the Node.js SDK for Azure Event hubs:
//   https://github.com/Azure/azure-event-hubs-node
const { EventHubClient, EventPosition } = require('@azure/event-hubs');

// CALLBACK FUNCTION
const printError = function (err) {
  console.log(err.message);
};

// CALLBACK FUNCTION
// Display the message content - telemetry and properties.
// - Telemetry is sent in the message body
// - The device can add arbitrary application properties to the message
// - IoT Hub adds system properties, such as Device Id, to the message.
const printMessage = function (message) {
  // this is the message body, JSON encoded
  console.log('Telemetry received: ');
  console.log(JSON.stringify(message.body));
  
  // this is the properties object, such as the alert code in SimulatedDevice.js
  console.log('Application properties (set by device): ')
  console.log(JSON.stringify(message.applicationProperties));

  // other info set by the Azure IO Hub
  console.log('System properties (set by IoT Hub): ')
  console.log(JSON.stringify(message.annotations));
  console.log('');
};

// SUBSCRIBE TO THE IO DEVICE MESSAGE
// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This example only reads messages sent after this application started.
let ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("Successully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
  console.log("The partition ids are: ", ids);
  return ids.map(function (id) {
    return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
}).catch(printError);

```
## Next

At this point, we have the simulated device that can send data to the IoT Hub, and a receiver that gets the data from the IoT hub. I set up
the sender running on a Beaglebone , and went to Starbucks with my laptop to see if I could get the data outside of my local network. Sure enough
I ran the ReadDeviceToCouldMessages.js program and it started receiving the simulated data. 

Here's the setup I have so far:

![alt text](../img/iot-experiment-3.png "Beaglebone to Laptop")  

Go to [Step 2](../step2/README.md). Turn the client side Azure IoT code into a node module.
