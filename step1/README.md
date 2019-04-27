# STEP 1 - Set Up Azure IOT Device
--------------------------------

## Create an account on Microsoft Azure
  
If you don't already have one, go to [Microsoft Azure](https://azure.microsoft.com) and create a free account.
You will get a $200.00 credit for 30 days, and a bunch of its services free for one year, plus another bunch
that are always free. Check out the list here : [Microsoft Azure Free Account List](https://azure.microsoft.com/en-us/free/free-account-faq/).
Most important for this project, the IOT Hub feature (what this project uses) is always free for 8000 messages per day.


## Go to the 'Portal'
  
Once you have an account, you can go to the management portal to get started. Once at the portal, click '+ Create a Resource'. Then from
the list, select 'IoT Hub Quickstart Tutorial'. This quickstart sets up everything needed to get bare bones device telemetry working.
Note that on Chrome it opens a new tab with the tutorial instructions. Keep the original Portal window open because the tutorial refers
you back to the portal to actually do things.

## Prerequisites
  
For the tutorial, before we deploy to the target IOT device, you can do the setup and test using your workstation (Linux, Mac or Windows). The quickstart requires one of several programming languages to be available. I am going to use JavaScript and NodeJS version 10. 
 - it asks you to download the sample code from github in a zip file. I forked the containing repo instead and used my copy going forward so I could changes and keep updates.

## Proceed with the Tutorial

This tutorial was very easy to follow (unlike the one on AWS) so **just follow it exactly and everything will work out**.

Here are a few hints to help out:
  - when you activate the Azure CLI, you have to select Powershell or Bash as your terminal. Pick the one you prefer. It appears to me that the Azure 'az' commands are the same for both terminals. 
  - when using the CLI, most things let you list what things you have installed. For example, the tutorial asks you to install the az IOT extension. Once you do that, you can check if it is there with 'az extension list -o table'. The '-o table' gives a summary list for all the list commands. Without it, you will probably get a JSON object with more information but a bit harder to read right off.
  - The CLI appears to keep its configuration after you log off and return later. The IOT extension should still be there. At least, it is for me.
  - One option with the CLI is to open a new browser tab and go the Azure portal again. Log in again if you need to. then you can start a new instance of the cloud shell and maximize it so you can use it separate from the portal window. The dialogs and pages to set up the IOT Hub take up a lot of space and having the CLI in a separate tab is helpful.

## Create an IOT Hub

Hints:
- the tutorial will refer you back the the portal to start setting up the IOT hub. After you click '+ Create a resource', don't reselect the quickstart. Use the search box to find 'IOT Hub' and go from there.
- You will be createing several objects, a resource group, a hub and a device. Its best to name them consistently. In my case, I named the resource group iot-telemetry-resource, the hub iot-telemetry-hub, and the device iot-telemetry-bbb (for Beaglebone Blue). 
- Even though I named the device with -bbb, the Azure IOT system doesn't really know which actual device you are using. You will be identifying the device with some authentication information, so for the tutorial you can use your workstation and later port that over to a real IOT device if you have one.
- When you get to the 'Size and Scale' page, you have to select the 'Scale Tier'. It suggests 'S1:Standard Tier'. You can change this to 'F1:Free Tier' to avoid a charge. The IOT support in the free tier is limited (8000 messages per day) but for familarizing with the whole process it is best. Once you really know what you are doing and want a real system you can start over with a paid tier. You can only have one IOT hub in the free tier so consider it a playground for learning.
- You can bail out of the IOT Hub create wizard until you click the 'Create' button. You will lose your edits but there aren't that many so if you don't like something you selected or just want to quit you can bail and nothing is created.
- Once you click 'Create' it takes a minute or two for the provisioning to complete.

## Register a Device

Hints:
 - the tutorial has you register your device using the CLI. This helps learn how to use the CLI, so eventually, like all pro's, you would do most things with a command line rather than wizards. However, you can create a device using a wizard. The first time through, follow the tutorial. Later, you can experiment with the wizard.
   - go the the dashboard.
   - click 'Resource Groups'
   - click the resource group you just created. it will take you to the list of resourcees.
   - your new IOT hub will be listed. click it
   - in the list to the left, click 'IoT devices'. 
   - to add a new one, click '+ Add'. 

 - When it tells you to 'make a note of' something in the CLI, it means copy it and paste it somewhere. Most of these are too long to 'make a note of'. 
 - **Don't include the connection strings and crypto keys in a public git/gitlab/github/etc repo.**

## Send Simulated Telemetry

Hints:
 - do this on your workstation to start.
 - the tutorial tells you to edit the file SimulatedDevice.js and paste in the connection string you got in the previous step. That's ok for this test, but its bad practice to hard code the string. Not only is it inflexible, the real problem is if you put this file in a public git repo, everyone can see your connection keys and do nefarious things with them. The proper way to include the key is to export it in an environment variable and then use your language facility to read that variable at runtime.
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

## Deploy to real IOT device

Since I forked the repo all I need to do is log in to my Beaglebone, clone the repo, and set up the Quickstart simulated device as above in 'Send Simualted Telemetry'.

