import sql from 'mssql';

class DatabaseSingleton {
  constructor(dbConfig) {
    this.config = dbConfig;
  }

  static getInstance(dbConfig) {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton(dbConfig);
    }
    return DatabaseSingleton.instance;
  }

  async executeQuery(query) {
    try {
      await sql.connect(this.config);
      const result = await sql.query(query);

      return result['recordsets'];
    } catch (err) {
      console.log(err)
      return null;
    }
  }
}

export default DatabaseSingleton;
