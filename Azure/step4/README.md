# Step 4 - Deploy Solution to the Web

At this point all the components are in place. Here is the final design diagram:

![alt text](../img/iot-experiment-5.png "IoT Experiment Design Final")

This implementation runs the IoT device code on a Beaglebone. The websocket server
and the html server run on a cloud VM using NGINX. But it isn't required to host
the websocket server and the html server on the same system or the same internet
host. 
