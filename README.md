# xMarkets

Welcome to xMarkets, a React based application allowing users to trade and speculate on event outcomes using Algorand (ALGO) cryptocurrency.

This application provides a simple and user-friendly platform for viewing and interacting with prediction markets. Users can purchase "yes" or "no" shares for a particular event. Once the event is resolved, shares can be sold for ALGO, with the rate depending on the outcome of the event.

## Features

- View various prediction markets
- Buy and sell shares in a prediction market
- Details about each market including number of "yes" and "no" shares, Algo Balance, days left until resolution, etc.
- Firebase integration for user authentication and data storage
- Use of Algorand's blockchain for transaction security

## Project Structure

The main components of the project are:

- `App.js`: This is the entry point of our application.
- `MarketList`: This component fetches market data and lists each market as a card.
- `MarketCard.js`: This is the component for each individual market. It shows detailed information about the market and includes forms for buying and selling shares.
- `FormComponent.js`: This component handles buying and selling of shares.
- `firebaseConfig`: This file contains the configuration for Firebase and includes initialization of Firebase services like Firestore and Authentication.

Assets like icons are stored in `src/assets/`.

The project also includes helper functions and constants.

## Setup Instructions

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install all dependencies.
4. Setup your Firebase project and replace the existing Firebase configuration in `src/firebaseConfig/index.js` with your own.
5. Run `npm start` to start the development server.

## Dependencies

- React
- Firebase (Firestore, Authentication)
- Algorand's blockchain
- Material-UI

## Contributing

We appreciate all contributions. If you are planning to contribute back to the codebase, please create an issue detailing what you want to do.

## License

Algo Markets is [MIT licensed](./LICENSE).

## Disclaimer

Algo Markets is a demonstration project and should not be used for real financial transactions. Please use it at your own risk.
