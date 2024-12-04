import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../globalContext.js';
import './home.css';

const HomePage = () => {
 
  const { globalVariable } = useGlobalContext();

  const [fanSpeed, setFanSpeed] = useState(3); // Initial fan speed
  const [mode, setMode] = useState('Default'); // Selected mode: Auto, Secure, Default
  const [fanstate, setFanstate] = useState(false); // Fan state
  const [lightstate, setLightstate] = useState(false); // Light state
  const [secure , setSecure] = useState(true) ;

  const handleModeChange = async(newMode) => {
  
    setMode(newMode);
    try {
      const response = await fetch(`${globalVariable}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode:newMode }),
      });
      if (!response.ok) throw new Error('Failed to change fan speed');
    } catch (error) {
      console.error('Error changing fan speed:', error);
    }

  }

  const handlefantoggle = async () => {
    let state = fanstate ? 'Off' : 'On';
    setFanstate(!fanstate);
    try {
      const response = await fetch(`${globalVariable}/Fan/${state}`);
      if (!response.ok) throw new Error('Failed to toggle fan state');
    } catch (error) {
      console.error('Error toggling fan:', error);
    }
  };

  const handleSpeedChange = async (e) => {
    const newSpeed = e.target.value;
    setFanSpeed(newSpeed);
    try {
      const response = await fetch(`${globalVariable}/Fan/speed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fanSpeed: newSpeed }),
      });
      if (!response.ok) throw new Error('Failed to change fan speed');
    } catch (error) {
      console.error('Error changing fan speed:', error);
    }
  };

  const handlelighttoggle = async () => {
    let state = lightstate ? 'Off' : 'On';
    setLightstate(!lightstate);
    try {
      const response = await fetch(`${globalVariable}/Light/${state}`);
      if (!response.ok) throw new Error('Failed to toggle light state');
    } catch (error) {
      console.error('Error toggling light:', error);
    }
  };

  
  // Fetch initial states from the server on page load
  useEffect(() => {
    
    const fetchInitialStates = async () => {
      try {
        const response = await fetch(`${globalVariable}/states`);
        if (!response.ok) throw new Error('Failed to fetch initial states');
        const data = await response.json();
        setFanSpeed(data.fanSpeed || 3);
        setFanstate(data.fanState || false);
        setLightstate(data.lightState || false);
        setMode(data.mode || "Default") ;
      } catch (error) {
        console.error('Error fetching initial states:', error);
      }
    };
    fetchInitialStates();
  }, [globalVariable]);

  const ringBuzzer = () => {
    const buzzerSound = new Audio('../assets/buzzer.mp3');
    buzzerSound.currentTime = 0; // Reset the audio to the start
    buzzerSound.play(); // Play the buzzer sound
  };

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`${globalVariable}`); // Replace with your WebSocket server URL
    ws.onopen = () => {
      console.log('Connected to WebSocket server.');
      let data = { type : "React-client"} ;
      ws.send(JSON.stringify(data));
    };

    // Listen for messages
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data) ;
        if(data.type == 'alert'){
            setSecure(false) ;
            //ringBuzzer() ;
        }
        else{
          setLightstate(data.state);
          setFanstate(data.state) ;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Handle WebSocket close
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);


  return (
    <div>
      <div className="mode-buttons">
        <button
          className={mode === 'Auto' ? 'active' : ''}
          onClick={() => handleModeChange('Auto')}
        >
          Auto Mode
        </button>
        <button
          className={mode === 'Secure' ? 'active' : ''}
          onClick={() => handleModeChange('Secure')}
        >
          Secure Mode
        </button>
        <button
          className={mode === 'Default' ? 'active' : ''}
          onClick={() => handleModeChange('Default')}
        >
          Default Mode
        </button>
      </div>
      {secure==false &&
         <div style={{backgroundColor:"red" , paddingLeft:"25vw", fontSize:30, padding:10 ,}}>
             SECURITY BREACHED ! 
             <button onClick={()=>{setSecure(true);}} style={{marginLeft:20 , fontSize:20 , borderRadius:10 , padding:5 ,backgroundColor:'greenyellow'}}>
                Reset
             </button>
          </div>
      }
      <div className="iot-cards">
        {/* Light Control */}
        <div className="card fan-card">
          <h3>Light Control</h3>
          {mode=='Default'? <label className="toggle-container">
            <input
              type="checkbox"
              checked={lightstate}
              onChange={handlelighttoggle}
            />
            <span className="toggle-slider"></span>
          </label>: 
            <p>Status: <strong>{lightstate ? 'On' : 'Off'}</strong></p>
          }
        </div>
        {/* Fan Control */}
        <div className="card fan-card">
          <h3>Fan Control</h3>
          <p>Fan Speed: <strong>{fanSpeed}</strong></p>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={fanSpeed}
            onChange={handleSpeedChange}
            className="slider"
          />
          {mode=='Default' ?<label className="toggle-container">
            <input
              type="checkbox"
              checked={fanstate}
              onChange={handlefantoggle}
            />
            <span className="toggle-slider"></span>
          </label>: 
             <p>Status: <strong>{fanstate ? 'On' : 'Off'}</strong></p>
          }
        </div>
      </div>
    </div>
  );
};

export default HomePage;
