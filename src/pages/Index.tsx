
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import SectionHeader from '@/components/UI/SectionHeader';
import WeatherCard from '@/components/Weather/WeatherCard';
import CryptoCard from '@/components/Crypto/CryptoCard';
import NewsCard from '@/components/News/NewsCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
import { fetchNewsData } from '@/store/slices/newsSlice';

const Index: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const weather = useAppSelector(state => state.weather);
  const crypto = useAppSelector(state => state.crypto);
  const news = useAppSelector(state => state.news);
  const favorites = useAppSelector(state => state.favorites.items);
  
  // Filter favorites
  const favoriteWeather = weather.cities.filter(city => 
    favorites.some(fav => fav.id === city.id && fav.type === 'weather')
  );
  
  const favoriteCrypto = crypto.cryptocurrencies.filter(coin => 
    favorites.some(fav => fav.id === coin.id && fav.type === 'crypto')
  );

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        dispatch(fetchWeatherData()).unwrap(),
        dispatch(fetchCryptoData()).unwrap(),
        dispatch(fetchNewsData()).unwrap(),
      ]);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchAllData();
    
    // Set up periodic refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchAllData();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  return (
    <MainLayout>
      <DashboardHeader onRefresh={fetchAllData} isLoading={isLoading} />
      
      {error && (
        <ErrorDisplay message={error} onRetry={fetchAllData} />
      )}
      
      {/* Favorites Section */}
      {(favoriteWeather.length > 0 || favoriteCrypto.length > 0) && (
        <div className="mb-8">
          <SectionHeader title="Favorites" />
          
          {favoriteWeather.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Weather</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteWeather.map(city => (
                  <WeatherCard key={city.id} weather={city} />
                ))}
              </div>
            </div>
          )}
          
          {favoriteCrypto.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Cryptocurrencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteCrypto.map(coin => (
                  <CryptoCard key={coin.id} crypto={coin} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Weather Section */}
      <div className="mb-8">
        <SectionHeader title="Weather" linkText="View All" linkTo="/weather" />
        
        {weather.loading && weather.cities.length === 0 ? (
          <LoadingSpinner />
        ) : weather.error ? (
          <ErrorDisplay message={weather.error} onRetry={() => dispatch(fetchWeatherData())} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weather.cities.slice(0, 3).map(city => (
              <WeatherCard key={city.id} weather={city} />
            ))}
          </div>
        )}
      </div>
      
      {/* Cryptocurrency Section */}
      <div className="mb-8">
        <SectionHeader title="Cryptocurrencies" linkText="View All" linkTo="/crypto" />
        
        {crypto.loading && crypto.cryptocurrencies.length === 0 ? (
          <LoadingSpinner />
        ) : crypto.error ? (
          <ErrorDisplay message={crypto.error} onRetry={() => dispatch(fetchCryptoData())} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crypto.cryptocurrencies.slice(0, 3).map(coin => (
              <CryptoCard key={coin.id} crypto={coin} />
            ))}
          </div>
        )}
      </div>
      
      {/* News Section */}
      <div>
        <SectionHeader title="Latest News" />
        
        {news.loading && news.articles.length === 0 ? (
          <LoadingSpinner />
        ) : news.error ? (
          <ErrorDisplay message={news.error} onRetry={() => dispatch(fetchNewsData())} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.articles.slice(0, 6).map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
