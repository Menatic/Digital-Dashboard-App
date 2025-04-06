
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { updateCryptoPrice } from '@/store/slices/cryptoSlice';
import { addNotification } from '@/store/slices/notificationsSlice';

interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export const useWebSocket = (options: WebSocketOptions) => {
  const { url, reconnectInterval = 5000, reconnectAttempts = 5 } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const attemptRef = useRef(0);
  const dispatch = useAppDispatch();

  const connect = () => {
    try {
      // For CoinCap WebSocket - ensure proper connection format
      // Add fallback mechanism for WebSocket connection failures
      const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana,cardano,ripple');
      
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        attemptRef.current = 0;
        console.log('WebSocket connected');
      };

      // Add more robust error handling
      ws.onmessage = (event) => {
        try {
          if (!event.data) {
            console.warn('Received empty WebSocket message');
            return;
          }
          
          const data = JSON.parse(event.data);
          
          // Process CoinCap data
          // The data format is { "bitcoin": "29326.51", "ethereum": "1864.45", ... }
          Object.entries(data).forEach(([id, price]) => {
            if (price && typeof price === 'string') {
              const numericPrice = parseFloat(price);
              
              if (!isNaN(numericPrice)) {
                // Update crypto price in Redux store
                dispatch(updateCryptoPrice({ id, price: numericPrice }));
                
                // Add notification for significant price changes (e.g., >5%)
                // This is simplified - you'd want to compare with previous price
                const priceChange = Math.random() * 10 - 5; // Simulated for demo
                if (Math.abs(priceChange) > 5) {
                  dispatch(addNotification({
                    type: 'price_alert',
                    title: `${id.charAt(0).toUpperCase() + id.slice(1)} Price Alert`,
                    message: `${id.charAt(0).toUpperCase() + id.slice(1)} price has ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChange).toFixed(2)}%`
                  }));
                }
              }
            }
          }); // Fixed: Properly closed the forEach callback
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        
        // Use mock data when WebSocket fails
        if (!isConnected) {
          // Simulate crypto price updates with mock data
          const mockCryptoUpdate = () => {
            const cryptos = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];
            const mockPrices = {
              bitcoin: 30000 + Math.random() * 2000,
              ethereum: 1800 + Math.random() * 200,
              solana: 100 + Math.random() * 20,
              cardano: 0.5 + Math.random() * 0.1,
              ripple: 0.6 + Math.random() * 0.1
            };
            
            cryptos.forEach(crypto => {
              dispatch(updateCryptoPrice({ 
                id: crypto, 
                price: mockPrices[crypto as keyof typeof mockPrices] 
              }));
            });
          };
          
          // Start mock updates
          const mockInterval = setInterval(mockCryptoUpdate, 5000);
          return () => clearInterval(mockInterval);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        
        // Attempt to reconnect if not exceeding max attempts
        if (attemptRef.current < reconnectAttempts) {
          attemptRef.current += 1;
          if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = window.setTimeout(connect, reconnectInterval);
        } else {
          setError('WebSocket connection closed after maximum reconnection attempts');
        }
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', err);
    }
  };

  useEffect(() => {
    connect();

    // Simulate weather alerts
    const weatherAlertInterval = setInterval(() => {
      // Random weather alert every 2-5 minutes
      if (Math.random() > 0.95) { // Low probability to avoid too many alerts
        const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris'];
        const alerts = ['Heavy Rain', 'Thunderstorm', 'Heat Wave', 'Strong Winds', 'Snowfall'];
        
        const city = cities[Math.floor(Math.random() * cities.length)];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        
        dispatch(addNotification({
          type: 'weather_alert',
          title: `Weather Alert: ${city}`,
          message: `${alert} expected in ${city} in the next few hours.`
        }));
      }
    }, 60000); // Check every minute

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      clearInterval(weatherAlertInterval);
    };
  }, [dispatch, reconnectAttempts, reconnectInterval]);

  return { isConnected, error };
};
