
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './screens/LoginScreen';
import Signup from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ErrorScreen from './screens/ErrorScreen';
import ProductScreen from './screens/ProductScreen';

const App = () => {
  return (
    <Router>
      <div>
      <header>
          <Link to="/items">Ankush Dukaan</Link>
        </header>
      <Routes>
        <Route path="/"  element={<Login/>} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/items" element={<HomeScreen />}/>
        <Route path="/product/:slug" element={<ProductScreen />} />
        <Route path="*" element={<ErrorScreen />} />

      </Routes>
      </div>
    </Router>
  );
};

export default App;