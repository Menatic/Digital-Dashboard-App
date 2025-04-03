# CryptoWeather Nexus

## Overview
CryptoWeather Nexus is a modern, multi-page dashboard that combines real-time weather data, cryptocurrency market information, and live notifications via WebSockets. The application is built using Next.js, React, Redux, and Tailwind CSS, with APIs for weather, cryptocurrency, and news data.

## Features
- **Weather Dashboard**: Displays temperature, humidity, and conditions for predefined cities (New York, London, Tokyo).
- **Cryptocurrency Dashboard**: Provides live price, 24h change, and market cap for major cryptocurrencies (Bitcoin, Ethereum, and one more).
- **News Section**: Fetches the top five crypto-related headlines.
- **City Details Page**: Shows weather history, charts, and tabular data.
- **Crypto Details Page**: Displays historical pricing and extended metrics.
- **Real-Time Updates**:
  - Uses WebSocket (CoinCap) to receive live crypto price updates.
  - Simulated weather alerts.
- **Redux State Management**:
  - Stores user preferences (favorite cities/cryptos).
  - Manages API data globally with loading/error states.
- **Favorites Feature**:
  - Allows users to save favorite cities and cryptocurrencies.
- **Responsive UI**:
  - Adapts seamlessly from mobile to desktop screens.
- **Deployment**:
  - Secure API keys using environment variables.
  - Hosted on Vercel/Netlify for public access.

## Tech Stack
- **Framework**: Next.js 13+
- **UI Library**: React.js with Hooks
- **State Management**: Redux with async middleware (Thunk/Saga)
- **Styling**: Tailwind CSS
- **Data Fetching**:
  - OpenWeatherMap API for weather data
  - CoinGecko API for cryptocurrency data
  - NewsData.io for crypto-related news
  - CoinCap WebSocket for live price updates

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cryptoweather-nexus.git
   cd cryptoweather-nexus
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Deployment
- The app is deployed on **Vercel/Netlify**.
- To deploy manually:
  ```bash
  vercel deploy
  ```

## Challenges & Solutions
### API Limitations
- Some APIs have rate limits, so caching and error handling were implemented to prevent frequent failures.
- Alternative APIs were explored in case of unavailability.

### WebSocket Integration
- Implemented WebSocket listeners for real-time price updates.
- Used Redux to store and display live notifications.

### UI & Responsiveness
- Tailwind CSS was used to create a seamless UI across different screen sizes.

## Testing (Optional)
- Unit tests for Redux logic and WebSocket handling can be added using Jest and React Testing Library.

