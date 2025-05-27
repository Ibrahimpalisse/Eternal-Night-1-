// frontend/src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Login from './pages/user/login';
import Register from './pages/user/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen"> {/* Utiliser Flexbox pour la mise en page */}
        <Navbar />
        <main className="flex-grow"> {/* Permet au contenu principal de prendre l'espace restant */}
          <Routes>
            {/* Route for the Home page */}
            <Route path="/" element={<Home />} />
            {/* Route for the Login page */}
            <Route path="/auth/login" element={<Login />} />
            {/* Route for the Register page */}
            <Route path="/auth/register" element={<Register />} />
            {/* Add other routes here as needed */}
          </Routes>
        </main>
        <Footer /> {/* Footer en bas */}
      </div>
    </BrowserRouter>
  );
}

export default App;