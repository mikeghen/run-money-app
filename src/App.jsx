import React, { useContext } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import { FaHome, FaRunning, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Members from './pages/Members.jsx';
import ClubActivities from './pages/ClubActivities.jsx';
import ClubView from './pages/ClubView.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clubs from './pages/Clubs.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';

// RainbowKit and Wagmi imports
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// WalletConnect project ID
const projectId = 'YOUR_PROJECT_ID';

import { defineChain } from 'viem';

import WelcomePage from './pages/WelcomePage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';

export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    // default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
  contracts: {
  },
});

// Configure chains and connectors
const config = getDefaultConfig({
  appName: 'Run Money',
  projectId,
  chains: [base, baseSepolia, anvil],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const clientId = "127717";

const Navigation = () => {
  const { token, logout } = useContext(AuthContext);

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`;
  };

  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="/" >
          <img src="/runmoney_logo.png" alt="Run Money Logo" width={75} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && <Nav.Link href="/dashboard"><FaChartBar className="me-2" /> Dashboard</Nav.Link>}
            {token && <Nav.Link href="/clubs"><FaHome className="me-2" /> Clubs</Nav.Link>}
            {/* {token && <Nav.Link href="/"><FaRunning className="me-2" /> Your Activities</Nav.Link>} */}
            {token && <Nav.Link onClick={logout}><FaSignOutAlt className="me-2" /> Logout</Nav.Link>}
          </Nav>
          <div className="d-flex align-items-center ms-auto">
            <ConnectButton />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <AuthProvider>
          <Router>
            <Navigation />
            <Toaster />
            <Container className="mt-4">
              <Routes>
                <Route exact path="/" element={<WelcomePage />} />
                <Route path="/members" element={<Members />} />
                <Route path="/club-activities" element={<ClubActivities />} />
                <Route path="/club-view" element={<ClubView />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clubs" element={<Clubs />} />
                <Route path="/clubs/:id" element={<ClubView />} />
                <Route path="/privacy" element={<PrivacyPolicyPage/>} />
                <Route path="/terms" element={<TermsOfServicePage/>} />
              </Routes>
              <br/> <br/>
              <footer>
                <Container>
                  <p>&copy; 2024 Run Money | <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link> | <Link to="https://runmoney.app/Support.html">Contact Support</Link>
                   </p>
                </Container>
              </footer>
            </Container>
            
          </Router>
        </AuthProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
