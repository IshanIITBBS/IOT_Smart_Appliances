const Fanmodel = require('../models/fan') ;


exports.turnOnFan = (req,res,next)=>{
    // axios.get(`http://${ESP32_IP}.local/Fan/On`)
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error));
    esp32Socket = req.destinationSocket ;
    if(Fanmodel.speed == 3)
        {
         esp32Socket.send("Fan_3") ;
        }
        else if(Fanmodel.speed == 2)
        {
            esp32Socket.send("Fan_2") ;
        }
        else
        {
            esp32Socket.send("Fan_1") ;
        }
        Fanmodel.state = 1;
}

exports.turnOffFan = (req,res,next)=>{
  
    esp32Socket = req.destinationSocket ;
    esp32Socket.send("FanOff") 
    Fanmodel.state = 0;
}


exports.Fanspeed = (req,res,next)=>{
    esp32Socket = req.destinationSocket ;
    fanSpeed = req.body.fanSpeed ;
    console.log(fanSpeed) ;
  
    if(fanSpeed == 3)
        {
         esp32Socket.send("Fan_3") ;
        }
        else if(fanSpeed == 2)
        {
            esp32Socket.send("Fan_2") ;
        }
        else
        {
            esp32Socket.send("Fan_1") ;
        }
        Fanmodel.speed = fanSpeed;
}