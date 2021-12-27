const mainConfig = {
  mainPort: 3000,
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

const firstProviderConfig = {
  firstPort: 3001,
  database: {
    server: 'localhost',
    database: 'Provider1',
    user: 'Bohdan',
    password: '123',
    port: 1433,
    options: {
      trustedConnection: true,
      trustServerCertificate: true,
    },
  },
};

const secondProviderConfig = {
  secondPort: 3002,
  database: {
    server: 'localhost',
    database: 'Provider2',
    user: 'Bohdan',
    password: '123',
    port: 1433,
    options: {
      trustedConnection: true,
      trustServerCertificate: true,
    },
  },
};

export {mainConfig, firstProviderConfig, secondProviderConfig};
