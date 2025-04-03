
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { toast } from '@/hooks/use-toast';
import { addNotification } from '@/store/slices/notificationsSlice';
import { updateCryptoPrice } from '@/store/slices/cryptoSlice';

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnect = true,
  reconnectInterval = 5000,
  reconnectAttempts = 10,
}: UseWebSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const dispatch = useAppDispatch();

  const handlePriceUpdate = (data: any) => {
    if (data.type === 'price_update') {
      // Dispatch the action as any type to avoid TypeScript errors
      dispatch(updateCryptoPrice(data) as any);
      
      // Only show notifications for significant price changes (>= 1%)
      if (Math.abs(data.priceChangePercent) >= 1) {
        const isPositive = data.priceChangePercent > 0;
        const message = `${data.name} (${data.symbol.toUpperCase()}) ${isPositive ? 'up' : 'down'} ${Math.abs(data.priceChangePercent).toFixed(2)}%`;
        
        // Show toast notification
        toast({
          title: `Price Alert: ${data.name}`,
          description: message,
          variant: isPositive ? 'default' : 'destructive',
        });
        
        // Add to notifications center
        dispatch(addNotification({
          id: `price-${data.id}-${Date.now()}`,
          title: `Price Alert: ${data.name}`,
          message,
          type: 'price_alert',
          read: false,
          timestamp: Date.now(),
        }));
      }
    }
  };

  const connect = () => {
    try {
      console.info('Connecting to WebSocket...');
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.info('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        if (onOpen) onOpen();
      };

      socketRef.current.onclose = () => {
        console.info('WebSocket disconnected');
        setIsConnected(false);
        if (onClose) onClose();
        
        if (reconnect && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
          handlePriceUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const send = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    isConnected,
    send,
    connect,
    disconnect,
  };
}
