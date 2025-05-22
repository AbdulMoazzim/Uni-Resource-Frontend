import React from 'react';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
