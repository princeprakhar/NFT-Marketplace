import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import NFTDetail from './pages/NFTDetail';
import Create from './pages/Create';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Web3Provider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/nft/:id" element={<NFTDetail />} />
              <Route path="/create" element={<Create />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Web3Provider>
    </Router>
  );
};

export default App;