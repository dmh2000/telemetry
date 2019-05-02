// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict";

// Using the Node.js SDK for Azure Event hubs:
//   https://github.com/Azure/azure-event-hubs-node
// The sample connects to an IoT hub's Event Hubs-compatible endpoint
// to read messages sent from a device.
const { EventHubClient, EventPosition } = require("@azure/event-hubs");

class TelemetryReceiver {
  // Connection string for the IoT Hub service
  //
  // NOTE:
  // For simplicity, this sample sets the connection string in code.
  // In a production environment, the recommended approach is to use
  // an environment variable to make it available to your application
  // or use an x509 certificate.
  // https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security
  //
  // Using the Azure CLI:
  // az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
  constructor(connstring) {
    this.connectionString = connstring;
    this.data = {"temperature":0,"humidity":0};
  }

  getTelemetry = () => {
    return this.data;
  }

  update = (message) => {
    this.data = message;
    this.printMessage(message);
  }

  printError = (err)  =>{
    console.log(err.message);
  };

  // Display the message content - telemetry and properties.
  // - Telemetry is sent in the message body
  // - The device can add arbitrary application properties to the message
  // - IoT Hub adds system properties, such as Device Id, to the message.
  printMessage = (message) => {
    console.log("Telemetry received: ");
    console.log(JSON.stringify(message.body));
    console.log("Application properties (set by device): ");
    console.log(JSON.stringify(message.applicationProperties));
    console.log("System properties (set by IoT Hub): ");
    console.log(JSON.stringify(message.annotations));
    console.log("");
  };

  // Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
  // This example only reads messages sent after this application started.
  run = () => {
    let ehClient;
    EventHubClient.createFromIotHubConnectionString(
      this.connectionString
    )
      .then((client) => {
        console.log(
          "Successully created the EventHub Client from iothub connection string."
        );
        ehClient = client;
        return ehClient.getPartitionIds();
      })
      .then((ids) => {
        console.log("The partition ids are: ", ids);
        return ids.map((id) => {
          return ehClient.receive(id, this.update, this.printError, {
            eventPosition: EventPosition.fromEnqueuedTime(Date.now())
          });
        });
      })
      .catch(this.printError);
  };
}

module.exports = TelemetryReceiver;