
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingDown, TrendingUp } from 'lucide-react';
import { CryptoData } from '@/store/slices/cryptoSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleFavorite } from '@/store/slices/favoritesSlice';

interface CryptoCardProps {
  crypto: CryptoData;
}

const formatPrice = (price: number): string => {
  return price >= 1
    ? price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : price.toFixed(6);
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString()}`;
};

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === crypto.id && item.type === 'crypto');
  
  const priceChangeColor = crypto.priceChangePercentage24h >= 0 ? 'text-success' : 'text-destructive';
  const PriceChangeIcon = crypto.priceChangePercentage24h >= 0 ? TrendingUp : TrendingDown;

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ id: crypto.id, type: 'crypto' }));
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
              {crypto.image ? (
                <img src={crypto.image} alt={crypto.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold">{crypto.symbol.toUpperCase()}</span>
              )}
            </div>
            <CardTitle className="text-lg font-medium">
              {crypto.name}
              <span className="ml-2 text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleFavorite}
            className="h-8 w-8"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-2xl font-bold">${formatPrice(crypto.price)}</p>
          <div className={`flex items-center ${priceChangeColor}`}>
            <PriceChangeIcon className="h-4 w-4 mr-1" />
            <span className="font-medium">{Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm">{formatMarketCap(crypto.marketCap)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm">{formatMarketCap(crypto.volume24h)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link 
          to={`/crypto/${crypto.id}`} 
          className="text-sm text-primary hover:underline w-full text-center"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CryptoCard;
