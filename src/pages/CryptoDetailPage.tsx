
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import PriceChart from '@/components/Charts/PriceChart';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchCryptoData, CryptoData } from '@/store/slices/cryptoSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, TrendingDown, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { toggleFavorite } from '@/store/slices/favoritesSlice';

const formatPrice = (price: number): string => {
  return price >= 1
    ? price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : price.toFixed(6);
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)} Trillion`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)} Billion`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)} Million`;
  return `$${marketCap.toLocaleString()}`;
};

const CryptoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { cryptocurrencies, loading, error } = useAppSelector(state => state.crypto);
  const favorites = useAppSelector(state => state.favorites.items);
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ time: number; value: number }[]>([]);
  
  const isFavorite = favorites.some(item => item.id === id && item.type === 'crypto');
  
  useEffect(() => {
    if (cryptocurrencies.length === 0 && !loading) {
      dispatch(fetchCryptoData());
    } else {
      const foundCrypto = cryptocurrencies.find(c => c.id === id);
      if (foundCrypto) {
        setCrypto(foundCrypto);
        
        // Generate mock price history data for the chart
        const now = new Date();
        const mockData = Array.from({ length: 24 }, (_, i) => {
          const time = new Date(now);
          time.setHours(now.getHours() - 23 + i);
          
          // Calculate price with some variance
          const volatility = foundCrypto.id === 'bitcoin' ? 0.02 : 0.04; // 2-4% volatility
          const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
          const basePrice = foundCrypto.price * 0.95; // Start slightly lower
          const timeProgress = i / 24; // 0 to 1 as time progresses
          const trendFactor = 1 + (timeProgress * 0.1); // Slight upward trend
          
          return {
            time: time.getTime(),
            value: basePrice * randomFactor * trendFactor,
          };
        });
        
        setPriceHistory(mockData);
      }
    }
  }, [dispatch, cryptocurrencies, id, loading]);
  
  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleFavorite({ id, type: 'crypto' }));
    }
  };
  
  if (loading && !crypto) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <ErrorDisplay message={error} onRetry={() => dispatch(fetchCryptoData())} />
      </MainLayout>
    );
  }
  
  if (!crypto) {
    return (
      <MainLayout>
        <ErrorDisplay message="Cryptocurrency data not found" />
        <div className="mt-4">
          <Link to="/crypto" className="text-primary hover:underline">
            &larr; Back to Cryptocurrencies
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const priceChangeColor = crypto.priceChangePercentage24h >= 0 ? 'text-success' : 'text-destructive';
  const PriceChangeIcon = crypto.priceChangePercentage24h >= 0 ? TrendingUp : TrendingDown;
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/crypto" className="text-primary hover:underline inline-flex items-center">
          &larr; Back to Cryptocurrencies
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="flex items-center">
          {crypto.image && (
            <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
              <img 
                src={crypto.image} 
                alt={crypto.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {crypto.name} <span className="text-muted-foreground text-xl">({crypto.symbol.toUpperCase()})</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date(crypto.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleToggleFavorite}
          className="mt-4 md:mt-0"
        >
          <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Price Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="text-muted-foreground mb-1">Current Price</div>
              <div className="text-4xl font-bold">${formatPrice(crypto.price)}</div>
              <div className={`flex items-center mt-2 ${priceChangeColor}`}>
                <PriceChangeIcon className="h-5 w-5 mr-1" />
                <span className="font-medium">
                  {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}% (24h)
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg font-medium">{formatMarketCap(crypto.marketCap)}</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="text-lg font-medium">{formatMarketCap(crypto.volume24h)}</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Circulating Supply</div>
                <div className="text-lg font-medium">{crypto.circulatingSupply.toLocaleString()} {crypto.symbol.toUpperCase()}</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Rank</div>
                <div className="text-lg font-medium">{cryptocurrencies.findIndex(c => c.id === crypto.id) + 1}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Price Chart */}
        <div className="lg:col-span-2">
          <PriceChart
            title="24-Hour Price History"
            data={priceHistory}
            color="#06b6d4"
            valuePrefix="$"
          />
        </div>
      </div>
      
      {/* Market Stats */}
      <h2 className="text-xl font-semibold mb-4">Market Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <DollarSign className="h-5 w-5 mr-2" />
              Price Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">All-Time High</div>
                <div className="font-medium">${formatPrice(crypto.price * 1.5)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">All-Time Low</div>
                <div className="font-medium">${formatPrice(crypto.price * 0.3)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">90-Day High</div>
                <div className="font-medium">${formatPrice(crypto.price * 1.2)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">90-Day Low</div>
                <div className="font-medium">${formatPrice(crypto.price * 0.8)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="text-muted-foreground">Price Change (7d)</div>
                <div className={crypto.priceChangePercentage24h > 0 ? 'text-success' : 'text-destructive'}>
                  {crypto.priceChangePercentage24h > 0 ? '+' : ''}{(crypto.priceChangePercentage24h * 1.5).toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Clock className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">Fully Diluted Valuation</div>
                <div className="font-medium">{formatMarketCap(crypto.marketCap * 1.2)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">Max Supply</div>
                <div className="font-medium">
                  {(crypto.circulatingSupply * 1.5).toLocaleString()} {crypto.symbol.toUpperCase()}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">Total Supply</div>
                <div className="font-medium">
                  {(crypto.circulatingSupply * 1.2).toLocaleString()} {crypto.symbol.toUpperCase()}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <div className="text-muted-foreground">Market Cap Dominance</div>
                <div className="font-medium">
                  {crypto.id === 'bitcoin' ? '45.2%' : crypto.id === 'ethereum' ? '18.7%' : '3.1%'}
                </div>
              </div>
              <div className="flex justify-between py-2">
                <div className="text-muted-foreground">Market Cap Rank</div>
                <div className="font-medium">#{cryptocurrencies.findIndex(c => c.id === crypto.id) + 1}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CryptoDetailPage;
