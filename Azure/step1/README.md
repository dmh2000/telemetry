# STEP 1 - Set Up Azure IoT Device
--------------------------------

## Create an account on Microsoft Azure
  
If you don't already have one, go to [Microsoft Azure](https://azure.microsoft.com) and create a free account.
You will get a $200.00 credit for 30 days, and a bunch of its services free for one year, plus another bunch
that are always free. Check out the list here : [Microsoft Azure Free Account List](https://azure.microsoft.com/en-us/free/free-account-faq/).
Most important for this project, the IoT Hub feature (what this project uses) is always free for 8000 messages per day.


## Go to the 'Portal'
  
Once you have an account, you can go to the management 'Portal' to get started. Once at the portal, click '+ Create a Resource'. Then from
the list, select 'IoT Hub Quickstart Tutorial'. This quickstart sets up everything needed to get bare bones device telemetry working.
Note that on Chrome it opens a new tab with the tutorial instructions. Keep the original Portal window open because the tutorial refers
you back to the portal to actually do things.

## Prerequisites
  
For the tutorial, before we deploy to the target IoT device, you can do the setup and test using your workstation (Linux, Mac or Windows). The quickstart requires one of several programming languages to be available. I am going to use JavaScript and NodeJS version 10. 
 - it asks you to download the sample code from github in a zip file. I forked the containing repo instead and used my copy going forward so I could make changes and keep updates.

## Proceed with the Tutorial

This tutorial was very easy to follow so **just follow it exactly and everything will work out**. In fact, you don't really need me
to tell you anything. The tutorial is excellent. I am adding a few hints that are worth reading but they aren't necessary to complete the tutorial.

Here are a few hints to help out:
  - when you activate the Azure CLI, you have to select Powershell or Bash as your terminal. Pick the one you prefer. It appears to me that the Azure 'az' commands are the same for both terminals. 
  - when using the CLI, most things let you list what things you have installed. For example, the tutorial asks you to install the az IoT extension. Once you do that, you can check if it is there with 'az extension list -o table'. The '-o table' gives a summary list for all the list commands. Without it, you will probably get a JSON object with more information but a bit harder to read right off.
  - The CLI appears to keep its configuration after you log off and return later. The IoT extension should still be there. At least, it is for me.
  - One option with the CLI is to open a new browser tab and go the Azure portal again. Log in again if you need to. then you can start a new instance of the cloud shell and maximize it so you can use it separate from the portal window. The dialogs and pages to set up the IoT Hub take up a lot of space and having the CLI in a separate tab is helpful.

## Create an IoT Hub

Hints:
- the tutorial will refer you back the the portal to start setting up the IoT hub. 
- You will be creating several objects, a resource group, a hub and a device. Its best to name them consistently. In my case, I named the resource group iot-telemetry-resource, the hub iot-telemetry-hub, and the device iot-telemetry-bbb (for Beaglebone Blue). 
- Even though I named the device with -bbb, the Azure IoT system doesn't really know which physical device you are using. You will be identifying the device with some authentication information, so for the tutorial you can use your workstation and later port that over to a real IoT device if you have one. 
- When you get to the 'Size and Scale' page, you have to select the 'Scale Tier'. It suggests 'S1:Standard Tier'. You can change this to 'F1:Free Tier' to avoid a charge. The IoT support in the free tier is limited (8000 messages per day) but for familarizing with the whole process it is best. Once you really know what you are doing and want a real system you can start over with a paid tier. You can only have one IoT hub in the free tier so consider it a playground for learning.
- You can bail out of the IoT Hub create wizard until you click the 'Create' button. You will lose your edits but there aren't that many so if you don't like something you selected or just want to quit you can bail and nothing is created.
- Once you click 'Create' it takes a minute or two for the provisioning to complete.

## Register a Device

Hints:
 - the tutorial has you register your device using the CLI. This helps learn how to use the CLI, so eventually, like all pro's, you would do most things with a command line rather than wizards. However, you can create a device using a wizard. The first time through, follow the tutorial. Later, you can experiment with the wizard.
   - go the the dashboard.
   - click 'Resource Groups'
   - click the resource group you just created. it will take you to the list of resourcees.
   - your new IoT hub will be listed. click it
   - in the list to the left, click 'IoT devices'. 
   - to add a new one, click '+ Add'. 

 - When it tells you to 'make a note of' something in the CLI, it means copy it and paste it somewhere. Most of these are too long to 'make a note of'. 
 - **Don't include the connection strings and crypto keys in a public git/gitlab/github/etc repo.**

## Send Telemetry

Hints:
 - do this on your workstation to start.
 - the tutorial tells you to edit the file SimulatedDevice.js and paste in the connection string you got in the previous step. That's ok for this test, but its bad practice to hard code the string. Not only is it inflexible, the real problem is if you put this file in a public git repo, everyone can see your connection keys and do nefarious things with them. The proper way to include the key is to export it in an environment variable or other source that is not stored in the repo, and then use your language facility to read that variable at runtime.
 - Other than setting the connection strings, the two files should run and show good results. 
 - 
## Receive Telemetry

Hints:
 - note that in the ReadDeviceToCloudMessages.js file, the proper way to use a connection string is used.
 - Other than setting the connection strings, the two files should run and show good results. 
  
## METRICS

One thing the tutorial doesn't show is that the Azure dashboard will let you see metrics of activity of whatever you are doing, in this case sending and
receiving telemetry messages. 
   - go to the Dashboard
   - click 'All resources'
   - click your iot hub name
   - in the menu for the hub, scroll down to 'Monitoring' and select 'Metrics'. you can see various graphs of what activity occurred.

## Note on multiple Azure subscriptions

Note: if you have more than one subscription to Azure, say from an MSDN subscription and a Technet subscription, you will need to be
sure when you are using the Azure GUI and CLI that you are using is the same all the way through the tutorial. You can specify which
subscription you are using in the GUI and CLI. If you are enough of an expert to have more than one subscription,  I'll leave it to your
to figure out how to set them. If you don't ensure you set them properly, you'll get strange messages like 'that object doesn't exist', 
even though you just created it (because it is on a different subscription).

## Deploy to real IoT device

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

This is what runs on the IoT device. It connects to the IoT Hub service and sends periodic messages. It actually is a decent baseline for my app, just adding the right data to it.

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

Go to [Step 2](../step2/README.md).
