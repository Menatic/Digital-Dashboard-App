
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: string;
}

interface NewsState {
  articles: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Fetch news data
export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, let's use mock data instead of actual API calls
      const mockNewsData: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Surges Past $60,000 as Institutional Adoption Grows',
          description: 'Bitcoin reached a new milestone as major financial institutions continue to invest in the leading cryptocurrency.',
          url: '#',
          source: 'CryptoNews',
          imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Ethereum Layer 2 Solutions Gain Traction Amid High Gas Fees',
          description: 'As Ethereum gas fees remain high, users are increasingly turning to Layer 2 scaling solutions for transactions.',
          url: '#',
          source: 'BlockchainReport',
          imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Major Bank Launches Cryptocurrency Custody Service',
          description: 'A leading financial institution has announced a new service allowing clients to securely store their digital assets.',
          url: '#',
          source: 'FinanceDaily',
          imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          title: 'Regulators Propose New Framework for Cryptocurrency Oversight',
          description: 'Government agencies are working on updated regulations to address the growing cryptocurrency market.',
          url: '#',
          source: 'CryptoInsider',
          imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          title: 'NFT Market Rebounds with Record-Breaking Sales',
          description: 'After a period of decline, the non-fungible token market is showing signs of recovery with several high-profile sales.',
          url: '#',
          source: 'ArtTech',
          imageUrl: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          title: 'DeFi Protocol Secures $50 Million in Funding Round',
          description: 'A promising decentralized finance project has attracted significant investment to expand its ecosystem and user base.',
          url: '#',
          source: 'DeFiDaily',
          imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
          publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockNewsData;
    } catch (error) {
      return rejectWithValue('Failed to fetch news data');
    }
  }
);

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default newsSlice.reducer;
