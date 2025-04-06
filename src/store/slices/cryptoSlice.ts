
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  image: string;
  lastUpdated: number;
}

interface CryptoState {
  cryptocurrencies: CryptoData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CryptoState = {
  cryptocurrencies: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// List of cryptocurrencies to fetch
const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];

// Fetch cryptocurrency data from CoinGecko API
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`Error fetching crypto data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const cryptoData: CryptoData[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.current_price,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        circulatingSupply: coin.circulating_supply,
        image: coin.image,
        lastUpdated: Date.now(),
      }));
      
      return cryptoData;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch cryptocurrency data');
    }
  }
);

// Update crypto price via WebSocket
export const updateCryptoPrice = createAsyncThunk(
  'crypto/updateCryptoPrice',
  async (data: { id: string, price: number }, { getState, rejectWithValue }) => {
    try {
      return data;
    } catch (error) {
      return rejectWithValue('Failed to update cryptocurrency price');
    }
  }
);

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action: PayloadAction<CryptoData[]>) => {
        state.loading = false;
        state.cryptocurrencies = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCryptoPrice.fulfilled, (state, action) => {
        const { id, price } = action.payload;
        const crypto = state.cryptocurrencies.find(c => c.id === id);
        if (crypto) {
          const oldPrice = crypto.price;
          crypto.price = price;
          crypto.priceChangePercentage24h = ((price - oldPrice) / oldPrice) * 100 + crypto.priceChangePercentage24h;
          crypto.lastUpdated = Date.now();
        }
      });
  },
});

export default cryptoSlice.reducer;
