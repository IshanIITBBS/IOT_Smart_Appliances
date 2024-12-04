import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import your components
import Home from './pages/home';
import Navbar from './components/navbar';
import { GlobalProvider } from './globalContext';

const App = () => {
  return (
    <GlobalProvider>
    <Router>
      <div>
        {/* Navigation Bar */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </Router>
    </GlobalProvider>
  );
};

export default App;
