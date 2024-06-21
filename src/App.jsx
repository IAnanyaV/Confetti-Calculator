// src/App.jsx
import React from 'react';
import Calculator from './components/calculator';
import './index.css';

const App = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <Calculator />
    </div>
  );
};

export default App;