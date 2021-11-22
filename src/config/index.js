const config = {
  port: 3000,
  database: {
    server: 'localhost',
    database: 'CurrencyExchange',
    user: 'Bohdan',
    password: '123',
    port: 1433,
    options: {
      trustedConnection: true,
      trustServerCertificate: true,
    },
  },
};

export default config;
