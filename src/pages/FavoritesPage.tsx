
import React, { useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WeatherCard from '@/components/Weather/WeatherCard';
import CryptoCard from '@/components/Crypto/CryptoCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
import { clearFavorites } from '@/store/slices/favoritesSlice';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const weather = useAppSelector(state => state.weather);
  const crypto = useAppSelector(state => state.crypto);

  // Filter favorites
  const favoriteWeather = weather.cities.filter(city =>
    favorites.some(fav => fav.id === city.id && fav.type === 'weather')
  );

  const favoriteCrypto = crypto.cryptocurrencies.filter(coin =>
    favorites.some(fav => fav.id === coin.id && fav.type === 'crypto')
  );

  // Fetch data if needed
  useEffect(() => {
    if (weather.cities.length === 0 && !weather.loading) {
      dispatch(fetchWeatherData());
    }
    
    if (crypto.cryptocurrencies.length === 0 && !crypto.loading) {
      dispatch(fetchCryptoData());
    }
  }, [dispatch, weather.cities.length, weather.loading, crypto.cryptocurrencies.length, crypto.loading]);

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
  };

  const isLoading = weather.loading || crypto.loading;
  const hasError = weather.error || crypto.error;
  const hasNoFavorites = favorites.length === 0;
  const hasNoData = favoriteWeather.length === 0 && favoriteCrypto.length === 0;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Your favorite weather locations and cryptocurrencies
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleClearFavorites}
          disabled={hasNoFavorites}
        >
          <Heart className="h-5 w-5 mr-2" />
          Clear All Favorites
        </Button>
      </div>

      {isLoading && hasNoData ? (
        <LoadingSpinner />
      ) : hasError ? (
        <ErrorDisplay 
          message={(weather.error || crypto.error) as string} 
          onRetry={() => {
            dispatch(fetchWeatherData());
            dispatch(fetchCryptoData());
          }} 
        />
      ) : hasNoFavorites ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Add weather locations and cryptocurrencies to your favorites by clicking the heart icon.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/weather'}>
              Explore Weather
            </Button>
            <Button onClick={() => window.location.href = '/crypto'} variant="outline">
              Explore Crypto
            </Button>
          </div>
        </div>
      ) : (
        <>
          {favoriteWeather.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Weather</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteWeather.map(city => (
                  <WeatherCard key={city.id} weather={city} />
                ))}
              </div>
            </div>
          )}
          
          {favoriteCrypto.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Cryptocurrencies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteCrypto.map(coin => (
                  <CryptoCard key={coin.id} crypto={coin} />
                ))}
              </div>
            </div>
          )}
          
          {favoriteWeather.length === 0 && favoriteCrypto.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Add weather locations and cryptocurrencies to your favorites by clicking the heart icon.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => window.location.href = '/weather'}>
                  Explore Weather
                </Button>
                <Button onClick={() => window.location.href = '/crypto'} variant="outline">
                  Explore Crypto
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default FavoritesPage;
