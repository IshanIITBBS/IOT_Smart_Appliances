
const express = require('express');
const WebSocket = require('ws');
const clientrouter = require('./routes/clientside')
const app = express();
const PORT = 5000;
const FanModel = require('./models/fan') ;
const LightModel = require('./models/light') ;
const { default: axios } = require('axios');
const cors = require('cors') ;
// Serve static files (if needed)
app.use(express.static('public'));
app.use(express.json()) ;
app.use(
    cors({
      origin: [
        "https://n9qrkhsl-3000.inc1.devtunnels.ms",
      ],
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );
  
// Create HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });
let esp32Socket = null ;
let reactSocket = null ;
// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send a message to the client

     if(ws == esp32Socket) { ws.send('Welcome to the WebSocket server!');    }
     ws.on('message', (message) => {
        try{
          const data = JSON.parse(message);
          if(data.status == "ESP32 Connected" )
          {
            esp32Socket = ws ;
          }
          else if(data.type == "React-client")
          {
            console.log('set') ;
            reactSocket = ws ;
          }
          else if(data == "Auto-status : 0")
          {
              data = { state : 0}
              reactSocket.send(data) ;
          }
          else if(data == "Auto-status : 1")
            {
                data = { state : 1}
                reactSocket.send(data) ;
            }
            if(data.status == "Intruder Alert")
              {
                let data = {
                  type:'alert',
                  status:'Intruder Alert'
                }
                reactSocket.send(JSON.stringify(data));
              }
            if(data.status == "Auto On")
            {
              let data = {
                type:'update',
                state:1
              }
              reactSocket.send(JSON.stringify(data))
            }
            if(data.status == "Auto Off")
              {
                let data = {
                  type:'update',
                  state:0
                }
                reactSocket.send(JSON.stringify(data))
              }
           
            
        }
        catch(error){

        }
      });
    
    
    // Handle connection close
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});



app.use((req, res, next) => {
    req.destinationSocket = esp32Socket; // Or use a shared object
    next();
  })

app.use(clientrouter)

