
const LightModel = require('../models/light') ;

exports.turnOnLight = (req,res,next)=>{
    esp32Socket = req.destinationSocket ;
    console.log('got a light request') ;
  
    console.log(LightModel.state) ;
    esp32Socket.send("LightOn") ;
    LightModel.state = 1 ;
}

exports.turnOffLight = (req,res,next)=>{
    // axios.get(`http://${ESP32_IP}.local/Fan/Off`)
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error));
    esp32Socket = req.destinationSocket ;
    console.log('got a light off request')  ;
    
    console.log(LightModel.state) ;
    esp32Socket.send("LightOff") ;
    LightModel.state = 0 ;
}

