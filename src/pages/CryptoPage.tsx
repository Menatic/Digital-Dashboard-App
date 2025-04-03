
import React, { useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import CryptoCard from '@/components/Crypto/CryptoCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const CryptoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cryptocurrencies, loading, error, lastUpdated } = useAppSelector(state => state.crypto);
  
  useEffect(() => {
    if (cryptocurrencies.length === 0 && !loading) {
      dispatch(fetchCryptoData());
    }
  }, [dispatch, cryptocurrencies.length, loading]);
  
  const handleRefresh = () => {
    dispatch(fetchCryptoData());
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cryptocurrencies</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading && cryptocurrencies.length === 0 ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} onRetry={handleRefresh} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptocurrencies.map(crypto => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default CryptoPage;
