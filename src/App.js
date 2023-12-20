import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booking from './Booking';
import Management from './Management';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Management />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
  );
}

export default App;
