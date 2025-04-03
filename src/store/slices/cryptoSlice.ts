
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

// Fetch cryptocurrency data
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, let's use mock data instead of actual API calls
      const mockCryptoData: CryptoData[] = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          price: 63592 + Math.random() * 1000,
          priceChangePercentage24h: 2.5 * (Math.random() > 0.5 ? 1 : -1),
          marketCap: 1224000000000,
          volume24h: 30000000000,
          circulatingSupply: 19460000,
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          lastUpdated: Date.now(),
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          price: 3053 + Math.random() * 100,
          priceChangePercentage24h: 1.8 * (Math.random() > 0.5 ? 1 : -1),
          marketCap: 365000000000,
          volume24h: 15000000000,
          circulatingSupply: 120000000,
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          lastUpdated: Date.now(),
        },
        {
          id: 'solana',
          symbol: 'sol',
          name: 'Solana',
          price: 144 + Math.random() * 10,
          priceChangePercentage24h: 3.2 * (Math.random() > 0.5 ? 1 : -1),
          marketCap: 62000000000,
          volume24h: 2500000000,
          circulatingSupply: 430000000,
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          lastUpdated: Date.now(),
        },
        {
          id: 'cardano',
          symbol: 'ada',
          name: 'Cardano',
          price: 0.45 + Math.random() * 0.05,
          priceChangePercentage24h: 1.5 * (Math.random() > 0.5 ? 1 : -1),
          marketCap: 15800000000,
          volume24h: 500000000,
          circulatingSupply: 35000000000,
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
          lastUpdated: Date.now(),
        },
        {
          id: 'ripple',
          symbol: 'xrp',
          name: 'XRP',
          price: 0.51 + Math.random() * 0.05,
          priceChangePercentage24h: 2.0 * (Math.random() > 0.5 ? 1 : -1),
          marketCap: 25800000000,
          volume24h: 1200000000,
          circulatingSupply: 50000000000,
          image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
          lastUpdated: Date.now(),
        },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockCryptoData;
    } catch (error) {
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
