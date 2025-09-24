# Algo Trading System Prototype

An algorithmic trading system prototype that implements various trading strategies, backtesting capabilities, and paper trading functionality. The system is built with Node.js and uses PostgreSQL for data persistence.

## API Documentation

https://documenter.getpostman.com/view/32416134/2sB3QCStCF

## Live Demo (Render Deployed Link)

https://algo-trading-system-prototype.onrender.com

## Features

- **Data Feeds**: Integration with Yahoo Finance package (yahoo-finance2) for both historical and live market data
- **Trading Strategies**:
  - Moving Average Crossover (SMA)
  - RSI (Relative Strength Index) Momentum Strategy
- **Backtesting**: Test trading strategies on historical data with detailed performance metrics
- **Paper Trading**: Simulate trading with virtual portfolios
- **Portfolio Management**: Track positions, trades, and performance metrics
- **Database Integration**: PostgreSQL for storing portfolio, positions, and trade data

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Market Data**: Yahoo Finance package (yahoo-finance2)

## Project Structure

```
Algo Trading System Prototype/
├── config/
│   └── prisma.js                 # Prisma client configuration
├── controllers/
│   ├── backtestController.js     # Backtest endpoint handlers
│   ├── dataController.js         # Market data endpoint handlers
│   ├── papertradeController.js   # Paper trading endpoint handlers
│   ├── portfolioController.js    # Portfolio management handlers
│   └── strategyController.js     # Strategy execution handlers
├── prisma/
│   ├── migrations/               # Database migration files
│   └── schema.prisma            # Database schema definition
├── routes/
│   ├── backtestRoutes.js        # Backtest API routes
│   ├── dataRoutes.js            # Market data API routes
│   ├── papertradeRoutes.js      # Paper trading API routes
│   ├── portfolioRoutes.js       # Portfolio API routes
│   └── strategyRoutes.js        # Strategy API routes
├── services/
│   ├── backtestService.js       # Backtesting business logic
│   ├── dataService.js           # Market data fetching logic
│   ├── papertradeService.js     # Paper trading business logic
│   ├── portfolioService.js      # Portfolio management logic
│   └── strategyService.js       # Strategy execution logic
├── utils/
│   └── errorResponse.js         # Error handling utility
├── .env                         # Environment variables
├── .gitignore                  # Git ignore file
├── index.js                    # Application entry point
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## API Endpoints

### Data Routes

- `GET /data/historical/:symbol` - Get historical data for a symbol
- `GET /data/live/:symbol` - Get live price for a symbol

### Strategy Routes

- `POST /strategy/run` - Run a trading strategy

### Backtest Routes

- `POST /backtest` - Run strategy backtesting

### Paper Trade Routes

- `POST /papertrade` - Execute paper trades

### Portfolio Routes

- `POST /portfolio` - Create a new portfolio
- `GET /portfolio/:userName` - Get portfolio details
- `PATCH /portfolio/addCapital` - Add capital to portfolio

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/novneetsingh/Algo-Trading-System-Prototype.git
   cd Algo-Trading-System-Prototype

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a .env file in the root directory and add:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=Algo_Trading_System_Prototype"
   PORT=4000
   ```

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

# Development mode

```bash
npm run dev
```

# Production mode

```bash
npm start
```

## Development Approach

The system is built with a modular architecture following these principles:

- **Separation of Concerns**: Controllers, Services, and Routes are clearly separated
- **Error Handling**: Centralized error handling with custom ErrorResponse class
- **Database Design**: Proper relationships between Portfolio, Position, and Trade models
- **API Structure**: RESTful API design with clear endpoint purposes
- **Code Reusability**: Common functionalities are abstracted into services

## Future Improvements

1. Implement WebSocket for real-time price updates
2. Add more trading strategies (Bollinger Bands, MACD)
3. Enhance risk management features
4. Add user authentication and authorization
5. Implement a front-end dashboard
6. Add unit tests and integration tests
7. Deploy to a cloud platform
8. Add trade execution logs and analytics

## License

ISC
