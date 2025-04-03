
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useWebSocket } from '@/hooks/useWebSocket';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Initialize WebSocket connection (simulated for demo)
  useWebSocket({
    url: 'wss://simulated-websocket-url',
    reconnectInterval: 5000,
    reconnectAttempts: 5,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
