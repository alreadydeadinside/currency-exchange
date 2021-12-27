import QueryBuilder from '../shared/queryBuilder.js';
import Singleton from '../shared/singleton.js';
import {firstProviderConfig} from '../config/index.js';
import fetch from 'node-fetch';

class FirstProviderService {
  constructor() {
    this.queryBuilder = new QueryBuilder();
    this.singleton = Singleton.getInstance(firstProviderConfig.database);
  }

  async getByTitle(title) {
    const query = this.queryBuilder
      .select(['*'], 'Currencies')
      .where(`Name LIKE \'${title}%\'`)
      .execute();

    const result = await this.singleton.executeQuery(query);

    return result;
  }
}

export { FirstProviderService };
