const Fanmodel = require('../models/fan');
const LightModel = require('../models/light');
const modemodel = require('../models/modes') ;

exports.Sendstates = async (req, res, next) => {
    console.log("Got sate request : ", LightModel.state) ;
  try {
    const states = {
      fanSpeed: Fanmodel.speed, 
      fanState: Fanmodel.state, 
      lightState: LightModel.state, 
      mode:modemodel.mode 
    };
    res.send(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).send({ error: 'Failed to fetch states' });
  }
};

exports.Setmode = (req,res,next)=>{
    esp32Socket = req.destinationSocket ;
    mode =req.body.mode ;
    modemodel.mode = mode ;
    console.log(mode) ;
    if(mode == 'Default')
        {
            esp32Socket.send("Mode_0") ;
        } 
    else if(mode == 'Auto')
    {
        esp32Socket.send("Mode_1") ;
    }
    else 
    {
        esp32Socket.send("Mode_2") ;
    }

}