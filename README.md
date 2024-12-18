﻿# Home Automation System using IOT

 We have made a prototype of an IOT bases Home Automation System using ESP 32 microcontroller. It can be used to control household appliances in real time through a website.It can be controlle  d from anywhere in the world as long as the ESP32 has access to the internet (through a hotspot or a router). \
 \
 Basically the ESP32 microcontroller is connected to a [Web Socket server](./server). And the Web Socket Server is connected to the [Frontend Web Interface Client](./client) . The WebSocket Server and the ESP32 (as client) are linked using the code. The server acts as a real-time communication bridge, ensuring low-latency interactions between the user and the ESP32.  We host both the server and client and then used it.  

![image](https://github.com/user-attachments/assets/c6b25a87-a4e3-41ac-b0a3-c804e7f3e2b8)


The circuit Diagram for our ESP32 and essential appliances is as follows   

![image](https://github.com/user-attachments/assets/1f0d69df-d146-4d94-9711-c99a069a7209)


 
 The system offers 3 modes of operation
 - **Manual Mode:** It offers user with direct access to FAN and LIGHT. They can be turned on or off using the website and even the fan speed can be changed.
 - **Automatic Mode:**  In this mode we use the motion sensor. It activates devices when motion is detected. Fan and Light turn off automatically after 20 seconds of no motion to conserve energy.
 - **Security Mode:** When motion is detected by sensor, the system sends an intrusion alert message to the web interface via WebSocket. It also activates a strobe LED effect to deter intruders.

## How to Use it On Your Own

You should have the following things downloaded before hand:-
- Arduino IDE
- Node JS

Also u need to download libraries for the ESP32 board and the other libraries for interfacing Servo Motor, WebSocket etc
- In Board Manager download
  - esp32 by Espressif Systems 
- In Library Manager download
  - ESP32Servo 
  - ArduinoJson
  - WebSocketClient

Now you can host both the [server](./server) and [client](./client)

- Get that address of server and replace the value of WS Host with that address in the [ESP32 code](./esp32). 
- Also in the [ESP32 code](./esp32) replace the WIFI credentials with your own credentials for a mobile hotspot or a router.
- Now upload that code into the ESP32 board. We used the board DOIT ESP32 DEVKIT V1 board for our case. You can use any such board which has Wifi compatibility.
- Now you can go to the address of Frontend client.\
You will get a website like this. Here you can control al the essential appliances in the required mode
<img src="https://github.com/user-attachments/assets/92c89c43-6bc1-4e74-a40c-5741e871d64f" alt="drawing" style="height:700px;"/>


This is the setup we had

![WhatsApp Image 2024-12-04 at 18 46 24_65bdf1f2](https://github.com/user-attachments/assets/8f7408c1-ad36-40bc-9940-872838bd0faa)


 
