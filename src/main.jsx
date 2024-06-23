import React from 'react';
import ReactDOM from 'react-dom';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia, localhost } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from './App';

// WalletConnect project ID
const projectId = 'YOUR_PROJECT_ID';

// Configure chains and connectors
const config = getDefaultConfig({
  appName: 'Proof of Workout',
  projectId,
  chains: [base, baseSepolia, localhost],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);