import React from 'react';
import './card.css'; // Importing CSS for styling

const DeviceCard = ({ deviceName, status, onToggle }) => {
  return (
    <div className="device-card">
      <div className="device-header">
        <h3>{deviceName}</h3>
      </div>
      <div className="device-body">
        <p>Control your {deviceName} remotely from here.</p>
        
      </div>
    </div>
  );
};

export default DeviceCard;
